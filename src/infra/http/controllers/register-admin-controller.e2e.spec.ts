import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

describe('Register admin (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = (await import('@infra/database/prisma')).getPrisma()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /admins/register', async () => {
    const response = await request(app.server).post('/admins/register').send({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '(00) 98765-4321',
    })

    expect(response.statusCode).toEqual(201)

    const adminOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })
})
