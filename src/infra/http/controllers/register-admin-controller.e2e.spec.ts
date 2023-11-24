import { databaseE2ETests } from 'prisma/vitest-environment-prisma/setup-e2e'
import { app } from 'src/app'
import request from 'supertest'

describe('Register Admin (e2e)', () => {
  beforeAll(async () => {
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

    const adminOnDatabase = await databaseE2ETests.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })
})
