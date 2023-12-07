import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { SolicitationFactory } from 'test/factories/make-solicitation'
import request from 'supertest'

describe('Fetch pending solicitations (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let solicitationFactory: SolicitationFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    solicitationFactory = new SolicitationFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /solicitations', async () => {
    await solicitationFactory.makePrismaSolicitation()
    await solicitationFactory.makePrismaSolicitation()

    const response = await request(app.server).get('/solicitations').send()

    expect(response.statusCode).toEqual(200)

    const solicitationsOnDatabase = await prisma.solicitation.findMany()

    expect(solicitationsOnDatabase).toHaveLength(2)
  })
})
