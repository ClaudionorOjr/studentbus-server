import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { SolicitationFactory } from 'test/factories/make-solicitation'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'

describe('Fetch pending solicitations (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let solicitationFactory: SolicitationFactory
  let userFactory: UserFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    solicitationFactory = new SolicitationFactory(prisma)
    userFactory = new UserFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /solicitations', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    await solicitationFactory.makePrismaSolicitation()
    await solicitationFactory.makePrismaSolicitation()

    const accessToken = await jwtEncrypter.encrypt({ sub: user.id })
    const response = await request(app.server)
      .get('/solicitations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)

    const solicitationsOnDatabase = await prisma.solicitation.findMany()

    expect(solicitationsOnDatabase).toHaveLength(2)
  })
})
