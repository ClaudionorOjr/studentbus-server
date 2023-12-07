import { DeleteRouteListUseCase } from './delete-route-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeRouteList } from 'test/factories/make-route-list'
import { makeStudentList } from 'test/factories/make-student-list'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UnregisteredInstitutionError } from '@institutional/application/use-cases/errors/unregistered-institution-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'

let usersRepository: InMemoryUsersRepository
let studentsRepository: InMemoryStudentsRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: DeleteRouteListUseCase

describe('Delete route list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    responsiblesRepository = new InMemoryResponsiblesRepository()
    studentsRepository = new InMemoryStudentsRepository(
      usersRepository,
      responsiblesRepository,
    )
    studentListsRepository = new InMemoryStudentListsRepository(
      usersRepository,
      studentsRepository,
      responsiblesRepository,
    )
    routeListsRepository = new InMemoryRouteListsRepository(
      studentListsRepository,
    )
    sut = new DeleteRouteListUseCase(usersRepository, routeListsRepository)
  })

  it('should be able to delete a route list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))
    await studentListsRepository.create(
      makeStudentList({ listId: 'route-list-01' }),
    )
    await studentListsRepository.create(
      makeStudentList({ listId: 'route-list-01' }),
    )

    expect(routeListsRepository.routeLists).toHaveLength(1)
    expect(studentListsRepository.studentLists).toHaveLength(2)

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })
    expect(result.isSuccess()).toBe(true)

    expect(routeListsRepository.routeLists).toHaveLength(0)
    expect(studentListsRepository.studentLists).toHaveLength(0)
  })

  it('should not be able a non-existent user to delete a route list', async () => {
    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })

  it('should not be able to delete a non-existent route list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredInstitutionError)
  })
})
