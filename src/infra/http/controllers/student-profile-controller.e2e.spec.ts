import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { UserFactory } from 'test/factories/make-user'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Student profile (e2e)', () => {
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

  test('[GET] /students/me', async () => {
    const user = await userFactory.makePrismaUser({ role: 'STUDENT' })
    await userFactory.makePrismaStudent({}, user.id)

    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })

    const response = await request(app.server)
      .get('/students/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    const studentOnDatabase = await prisma.student.findUnique({
      where: {
        userId: user.id,
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(studentOnDatabase).toBeTruthy()
  })
})
