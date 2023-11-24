import { databaseE2ETests } from 'prisma/vitest-environment-prisma/setup-e2e'
import { app } from 'src/app'
import request from 'supertest'
import { makePrismaSolicitation } from 'test/factories/make-solicitation'

describe('Fetch pending solicitations (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /solicitations', async () => {
    await makePrismaSolicitation()
    await makePrismaSolicitation()

    const response = await request(app.server).get('/solicitations').send()

    expect(response.statusCode).toEqual(200)

    const solicitationsOnDatabase =
      await databaseE2ETests.solicitation.findMany()

    expect(solicitationsOnDatabase).toHaveLength(2)
  })
})
