import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterStudentUseCase } from './register-student'
import { InMemorySolicitationsRepository } from 'test/repositories/in-memory-solicitations-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeSolicitation } from 'test/factories/make-solicitation'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let solicitationsRepository: InMemorySolicitationsRepository
let usersRepository: InMemoryUsersRepository
let studentsRepository: InMemoryStudentsRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let sut: RegisterStudentUseCase

describe('Register student use case', () => {
  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository()
    usersRepository = new InMemoryUsersRepository()
    responsiblesRepository = new InMemoryResponsiblesRepository()
    studentsRepository = new InMemoryStudentsRepository(
      usersRepository,
      responsiblesRepository,
    )
    sut = new RegisterStudentUseCase(
      solicitationsRepository,
      usersRepository,
      studentsRepository,
      responsiblesRepository,
    )
  })

  it('should be able to register a student', async () => {
    await solicitationsRepository.create(
      await makeSolicitation({}, 'solicitation-01'),
    )

    expect(solicitationsRepository.solicitations).toHaveLength(1)

    const result = await sut.execute({ solicitationId: 'solicitation-01' })

    expect(result.isSuccess()).toBe(true)
    expect(solicitationsRepository.solicitations).toHaveLength(0)
    expect(usersRepository.users).toHaveLength(1)
    expect(studentsRepository.students).toHaveLength(1)
    expect(responsiblesRepository.responsibles).toHaveLength(1)

    expect(studentsRepository.students[0].userId).toEqual(
      usersRepository.users[0].id,
    )
    expect(studentsRepository.students[0].validatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to register a non-existent solicitation', async () => {
    const result = await sut.execute({ solicitationId: 'solicitation-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
