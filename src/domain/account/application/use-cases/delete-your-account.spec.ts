import 'reflect-metadata'
import { DeleteYourAccountUseCase } from './delete-your-account'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { makeStudent, makeUser } from 'test/factories/make-user'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

let usersRepository: InMemoryUsersRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let studentsRepository: InMemoryStudentsRepository
let sut: DeleteYourAccountUseCase

describe('Delete your account use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    responsiblesRepository = new InMemoryResponsiblesRepository()
    studentsRepository = new InMemoryStudentsRepository(
      usersRepository,
      responsiblesRepository,
    )
    sut = new DeleteYourAccountUseCase(usersRepository, studentsRepository)
  })

  it('should be able to delete a account', async () => {
    await usersRepository.create(makeUser({ role: 'DRIVER' }, 'user-01'))
    expect(usersRepository.users).toHaveLength(1)

    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isSuccess()).toBe(true)
    expect(usersRepository.users).toHaveLength(0)
  })

  it('should be able to delete a student account', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await studentsRepository.create(makeStudent({}, 'user-01'))
    expect(usersRepository.users).toHaveLength(1)
    expect(studentsRepository.students).toHaveLength(1)

    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isSuccess()).toBe(true)
    expect(usersRepository.users).toHaveLength(0)
    expect(studentsRepository.students).toHaveLength(0)
  })

  it('should not be able to delete a account from a non-existent user', async () => {
    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })
})
