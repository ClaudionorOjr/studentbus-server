import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { UserFactory } from 'test/factories/make-user'
import { SolicitationFactory } from 'test/factories/make-solicitation'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Refuse solicitation (e2e)', () => {
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

  test('[PATCH] /solicitations/:solicitationId/refuse', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = await jwtEncrypter.encrypt({
      sub: user.id,
      role: 'ADMIN',
    })

    const solicitation = await solicitationFactory.makePrismaSolicitation()

    const response = await request(app.server)
      .patch(`/solicitations/${solicitation.id}/refuse`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        refuseReason: 'refuse solicitation',
      })

    expect(response.statusCode).toEqual(204)

    const refusedSolicitation = await prisma.solicitation.findUnique({
      where: {
        id: solicitation.id,
      },
    })

    expect(refusedSolicitation).toBeTruthy()
    expect(refusedSolicitation?.status).toEqual('REFUSED')
  })
})
