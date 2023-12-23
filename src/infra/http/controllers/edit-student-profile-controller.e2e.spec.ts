import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { UserFactory } from 'test/factories/make-user'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'
import { faker } from '@faker-js/faker'

describe('Edit student profile (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    userFactory = new UserFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /students/me', async () => {
    const student = await userFactory.makePrismaStudent()

    const accessToken = await jwtEncrypter.encrypt({ sub: student.id })

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
        id: student.id,
      },
    })

    const updatedStudent = await prisma.student.findUnique({
      where: {
        userId: student.id,
      },
    })

    const updatedResponsible = await prisma.responsible.findFirst({
      where: {
        studentId: student.id,
      },
    })

    expect(updatedUser).toBeTruthy()
    expect(updatedStudent).toBeTruthy()
    expect(updatedResponsible).toBeTruthy()
  })
})
