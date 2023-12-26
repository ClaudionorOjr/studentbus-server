import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { UserFactory } from 'test/factories/make-user'
import { SolicitationFactory } from 'test/factories/make-solicitation'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Register student (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let userFactory: UserFactory
  let solicitationFactory: SolicitationFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    userFactory = new UserFactory(prisma)
    solicitationFactory = new SolicitationFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /solicitations/:solicitationId/register', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = await jwtEncrypter.encrypt({
      sub: user.id,
      role: 'ADMIN',
    })

    const solicitation = await solicitationFactory.makePrismaSolicitation()

    const response = await request(app.server)
      .post(`/solicitations/${solicitation.id}/register`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: solicitation.id,
      },
    })

    const studentOnDatabase = await prisma.student.findUnique({
      where: {
        userId: solicitation.id,
      },
    })

    expect(studentOnDatabase).toBeTruthy()
    expect(userOnDatabase).toBeTruthy()
  })
})
