import { beforeEach, describe, expect, it } from 'vitest'
import { EditStudentProfileUseCase } from './edit-student-profile'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeStudent, makeUser } from 'test/factories/make-user'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'

let usersRepository: InMemoryUsersRepository
let studentsRepository: InMemoryStudentsRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let sut: EditStudentProfileUseCase

describe('Edit student profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    studentsRepository = new InMemoryStudentsRepository(
      usersRepository,
      responsiblesRepository,
    )
    responsiblesRepository = new InMemoryResponsiblesRepository()
    sut = new EditStudentProfileUseCase(
      usersRepository,
      studentsRepository,
      responsiblesRepository,
    )
  })

  it('should be able a student to edit your profile data', async () => {
    const user = makeUser({}, 'user-01')
    const student = await makeStudent({ userId: user.id })

    await usersRepository.create(user)
    await studentsRepository.create(student)

    await sut.execute({
      userId: user.id,
      completeName: 'John doe',
      dateOfBirth: new Date('2002-03-12'),
    })

    expect(usersRepository.users[0]).toMatchObject({
      completeName: 'John doe',
    })
    expect(studentsRepository.students[0]).toMatchObject({
      dateOfBirth: new Date('2002-03-12'),
    })
  })
})
