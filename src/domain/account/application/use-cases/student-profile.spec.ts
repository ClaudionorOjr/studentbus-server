import 'reflect-metadata'
import { StudentProfileUseCase } from './student-profile'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-user'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { makeResponsible } from 'test/factories/make-responsible'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let studentsRepository: InMemoryStudentsRepository
let sut: StudentProfileUseCase

describe('Student profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    responsiblesRepository = new InMemoryResponsiblesRepository()

    studentsRepository = new InMemoryStudentsRepository(
      usersRepository,
      responsiblesRepository,
    )

    sut = new StudentProfileUseCase(studentsRepository)
  })

  it('should be able to show the student profile', async () => {
    const student = makeStudent({}, 'user-01')

    await studentsRepository.create(student)

    await responsiblesRepository.create(
      makeResponsible({ studentId: student.id }),
    )

    const result = await sut.execute({ studentId: 'user-01' })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      studentProfile: expect.objectContaining({ studentId: 'user-01' }),
    })
  })

  it('should not be able to show a profile with wrong id', async () => {
    const result = await sut.execute({ studentId: 'user' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
