import { FetchStudentBondsUseCase } from './fetch-student-bonds'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryBondsRepository } from 'test/repositories/in-memory-bonds-repository'
import { makeUser } from 'test/factories/make-user'
import { makeBond } from 'test/factories/make-bond'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

let usersRepository: InMemoryUsersRepository
let bondsRepository: InMemoryBondsRepository
let sut: FetchStudentBondsUseCase

describe('Fetch student bonds use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    bondsRepository = new InMemoryBondsRepository()
    sut = new FetchStudentBondsUseCase(usersRepository, bondsRepository)
  })

  it('should be able to fetch student bonds', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await bondsRepository.create(makeBond({ userId: 'user-01' }))
    await bondsRepository.create(makeBond())

    expect(bondsRepository.bonds).toHaveLength(2)

    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      bonds: expect.arrayContaining([
        expect.objectContaining({ userId: 'user-01' }),
      ]),
    })
  })

  it('should not be able to fetch bonds of a non-existent student', async () => {
    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })
})
