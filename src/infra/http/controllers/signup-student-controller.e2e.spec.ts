import { databaseE2ETests } from 'prisma/vitest-environment-prisma/setup-e2e'
import { app } from 'src/app'
import request from 'supertest'

describe('Sign up student (e2e)', () => {
  beforeAll(async () => {
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

    const solicicationOnDatabase =
      await databaseE2ETests.solicitation.findFirst({
        where: {
          email: 'johndoe@example.com',
        },
      })

    expect(solicicationOnDatabase).toBeTruthy()
  })
})
