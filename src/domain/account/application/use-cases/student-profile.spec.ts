import { beforeEach, describe, expect, it } from 'vitest'
import { StudentProfileUseCase } from './student-profile'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import {
  makeResponsible,
  makeStudent,
  makeUser,
} from 'test/factories/make-user'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'

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
    await usersRepository.create(await makeUser({}, 'user-01'))
    await studentsRepository.create(
      makeStudent({ userId: 'user-01' }, 'student-01'),
    )
    await responsiblesRepository.create(
      makeResponsible({ userId: 'student-01' }),
    )

    const { studentProfile } = await sut.execute({ userId: 'user-01' })

    expect(studentProfile).contains({ userId: 'user-01' })
  })

  it('should not be able to show a profile with wrong id', async () => {
    await expect(() => sut.execute({ userId: 'user' })).rejects.toBeInstanceOf(
      Error,
    )
  })
})
