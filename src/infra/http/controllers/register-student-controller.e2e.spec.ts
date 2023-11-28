import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { databaseE2ETests } from 'prisma/vitest-environment-prisma/setup-e2e'
import { makePrismaSolicitation } from 'test/factories/make-solicitation'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { makePrismaUser } from 'test/factories/make-user'

describe('Register Student (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = (await import('src/app')).app

    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  test('[POST] /solicitations/:solicitationId/register', async () => {
    const user = await makePrismaUser({ role: 'ADMIN' })

    const accessToken = await new JwtEncrypter().encrypt({
      sub: user.id,
      role: 'ADMIN',
    })

    // ! Remover esse código
    // const invalidToken =
    //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMB'

    const solicitation = await makePrismaSolicitation()

    const response = await request(app.server)
      .post(`/solicitations/${solicitation.id}/register`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(201)

    const userOnDatabase = await databaseE2ETests.user.findUnique({
      where: {
        id: solicitation.id,
      },
    })

    const studentOnDatabase = await databaseE2ETests.student.findUnique({
      where: {
        userId: solicitation.id,
      },
    })

    expect(studentOnDatabase).toBeTruthy()
    expect(userOnDatabase).toBeTruthy()
  })
})
