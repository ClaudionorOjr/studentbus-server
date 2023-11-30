import { getPrisma } from '@infra/database/prisma'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let userFactory: UserFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = getPrisma()
    userFactory = new UserFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 8),
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ accessToken: expect.any(String) })
  })
})
