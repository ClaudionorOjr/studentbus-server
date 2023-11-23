import { databaseE2ETests } from 'prisma/vitest-environment-prisma/setup-e2e'
import { app } from 'src/app'
import request from 'supertest'
import { makePrismaSolicitation } from 'test/factories/make-solicitation'

describe('Register Student (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  test('[POST] /solicitations/:solicitationId/register', async () => {
    const solicitation = await makePrismaSolicitation()

    const response = await request(app.server)
      .post(`/solicitations/${solicitation.id}/register`)
      .send()

    expect(response.statusCode).toEqual(201)

    const userOnDatabase = await databaseE2ETests.user.findUnique({
      where: {
        id: solicitation.id,
      },
    })

    const studentOnDatabase = await databaseE2ETests.student.findUnique({
      where: {
        userId: solicitation.id,
      },
    })

    expect(studentOnDatabase).toBeTruthy()
    expect(userOnDatabase).toBeTruthy()
  })
})
