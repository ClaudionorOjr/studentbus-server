import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let userFactory: UserFactory
  let bcryptHasher: BcryptHasher

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = (await import('@infra/database/prisma')).getPrisma()
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
