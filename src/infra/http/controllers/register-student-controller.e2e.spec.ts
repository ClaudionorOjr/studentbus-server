import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { UserFactory } from 'test/factories/make-user'
import { SolicitationFactory } from 'test/factories/make-solicitation'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Register student (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let userFactory: UserFactory
  let solicitationFactory: SolicitationFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    userFactory = new UserFactory(prisma)
    solicitationFactory = new SolicitationFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /solicitations/:solicitationId/register', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = await jwtEncrypter.encrypt({
      sub: user.id,
      role: 'ADMIN',
    })

    // ! Remover esse código
    // const invalidToken =
    //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMB'

    const solicitation = await solicitationFactory.makePrismaSolicitation()

    const response = await request(app.server)
      .post(`/solicitations/${solicitation.id}/register`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: solicitation.id,
      },
    })

    const studentOnDatabase = await prisma.student.findUnique({
      where: {
        userId: solicitation.id,
      },
    })

    expect(studentOnDatabase).toBeTruthy()
    expect(userOnDatabase).toBeTruthy()
  })
})
