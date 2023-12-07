import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { UserFactory } from 'test/factories/make-user'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let userFactory: UserFactory
  let bcryptHasher: BcryptHasher

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    userFactory = new UserFactory(prisma)
    bcryptHasher = new BcryptHasher()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      passwordHash: await bcryptHasher.hash('123456'),
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ accessToken: expect.any(String) })
  })
})
