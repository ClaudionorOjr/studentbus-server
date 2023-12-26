import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Register institution (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    userFactory = new UserFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  test('[POST] /institutions/register', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = await jwtEncrypter.encrypt({
      sub: user.id,
      role: 'ADMIN',
    })

    const response = await request(app.server)
      .post('/institutions/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Institution 1',
      })

    expect(response.statusCode).toEqual(201)

    const institutionOnDatabase = await prisma.institution.findUnique({
      where: {
        name: 'Institution 1',
      },
    })

    expect(institutionOnDatabase).toBeTruthy()
    expect(institutionOnDatabase).toEqual(
      expect.objectContaining({
        name: 'Institution 1',
      }),
    )
  })
})
