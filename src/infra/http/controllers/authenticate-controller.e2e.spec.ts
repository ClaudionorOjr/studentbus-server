import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { makePrismaUser } from 'test/factories/make-user'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = (await import('src/app')).app

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await makePrismaUser({
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
