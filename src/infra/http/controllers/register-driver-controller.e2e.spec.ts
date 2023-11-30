import { getPrisma } from '@infra/database/prisma'
import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

describe('Register driver (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = getPrisma()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /drivers/register', async () => {
    const response = await request(app.server).post('/drivers/register').send({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '(00) 98765-4321',
    })

    expect(response.statusCode).toEqual(201)

    const driverOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(driverOnDatabase).toBeTruthy()
  })
})
