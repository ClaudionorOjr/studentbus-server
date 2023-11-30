import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

describe('Sign up student (e2e)', () => {
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

  test('[POST] /signup', async () => {
    const response = await request(app.server).post('/signup').send({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '(00) 98765-4321',
      birthdate: '20/05/2002',
    })

    expect(response.statusCode).toEqual(201)

    const solicicationOnDatabase = await prisma.solicitation.findFirst({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(solicicationOnDatabase).toBeTruthy()
  })
})
