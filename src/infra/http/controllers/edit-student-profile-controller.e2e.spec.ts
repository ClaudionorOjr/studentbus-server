import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { faker } from '@faker-js/faker'

describe('Edit student profile (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let userFactory: UserFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = (await import('@infra/database/prisma')).getPrisma()
    userFactory = new UserFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /students/me', async () => {
    const user = await userFactory.makePrismaUser({ role: 'STUDENT' })
    await userFactory.makePrismaStudent({}, user.id)

    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })

    const response = await request(app.server)
      .put('/students/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        completeName: 'John Doe',
        phone: '(00) 98765-4321',
        birthdate: '12/03/1998',
        responsibleName: faker.person.fullName(),
        responsiblePhone: faker.phone.number(),
        degreeOfKinship: faker.word.adjective(),
      })

    expect(response.statusCode).toEqual(204)

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    const updatedStudent = await prisma.student.findUnique({
      where: {
        userId: user.id,
      },
    })

    const updatedResponsible = await prisma.responsible.findFirst({
      where: {
        userId: user.id,
      },
    })

    expect(updatedUser).toBeTruthy()
    expect(updatedStudent).toBeTruthy()
    expect(updatedResponsible).toBeTruthy()
  })
})
