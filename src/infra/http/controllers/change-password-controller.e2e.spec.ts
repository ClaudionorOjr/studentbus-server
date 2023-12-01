import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

describe('Change password (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let userFactory: UserFactory
  let jwtEncrypter: JwtEncrypter
  let bcryptHasher: BcryptHasher

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = (await import('@infra/database/prisma')).getPrisma()
    userFactory = new UserFactory(prisma)
    jwtEncrypter = new JwtEncrypter()
    bcryptHasher = new BcryptHasher()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /change-password', async () => {
    const user = await userFactory.makePrismaUser({
      passwordHash: await bcryptHasher.hash('123456'),
    })

    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })

    const response = await request(app.server)
      .patch('/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '123456',
        newPassword: '1234567',
      })

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    const passwordChanged = userOnDatabase!.password
    expect(await bcryptHasher.compare('1234567', passwordChanged)).toBeTruthy()
    expect(response.statusCode).toEqual(200)
  })
})
