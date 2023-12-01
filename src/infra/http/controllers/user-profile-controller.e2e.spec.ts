import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { UserFactory } from 'test/factories/make-user'

describe('User profile (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let userFactory: UserFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = (await import('@infra/database/prisma')).getPrisma()
    userFactory = new UserFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /me', async () => {
    const user = await userFactory.makePrismaUser({ role: 'DRIVER' })

    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
