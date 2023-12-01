import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'

describe('Delete your account (e2e)', () => {
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

  test('[DELETE] /me', async () => {
    const user = await userFactory.makePrismaUser({ role: 'DRIVER' })
    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })

    const response = await request(app.server)
      .delete('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })

  test('[DELETE] /me', async () => {
    const user = await userFactory.makePrismaUser({ role: 'STUDENT' })
    await userFactory.makePrismaStudent({}, user.id)
    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })

    const response = await request(app.server)
      .delete('/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const deletedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    const deletedStudent = await prisma.student.findUnique({
      where: {
        userId: user.id,
      },
    })

    expect(deletedUser).toBeNull()
    expect(deletedStudent).toBeNull()
  })
})
