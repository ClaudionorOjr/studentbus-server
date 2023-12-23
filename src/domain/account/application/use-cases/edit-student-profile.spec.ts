import 'reflect-metadata'
import { EditStudentProfileUseCase } from './edit-student-profile'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeStudent } from 'test/factories/make-user'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

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
      studentsRepository,
      responsiblesRepository,
    )
  })

  it('should be able a student to edit your profile data', async () => {
    const student = makeStudent({}, 'user-01')

    await studentsRepository.create(student)

    const result = await sut.execute({
      userId: student.id,
      completeName: 'John doe',
      birthdate: new Date('2002-03-12'),
    })

    expect(result.isSuccess()).toBe(true)

    expect(usersRepository.users[0]).toMatchObject({
      completeName: 'John doe',
    })

    expect(studentsRepository.students[0]).toMatchObject({
      birthdate: new Date('2002-03-12'),
    })
  })

  it('should not be able a non-existent user to edit a profile data', async () => {
    const result = await sut.execute({
      userId: 'user-01',
      completeName: 'John doe',
      birthdate: new Date('2002-03-12'),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).instanceOf(UnregisteredUserError)
  })
})
