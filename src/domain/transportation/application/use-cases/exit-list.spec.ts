import { ExitListUseCase } from './exit-list'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeStudentList } from 'test/factories/make-student-list'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeRouteList } from 'test/factories/make-route-list'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { UserNotOnListError } from './errors/user-not-on-list-error'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'

let usersRepository: InMemoryUsersRepository
let studentsRepository: InMemoryStudentsRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let studentListsRepository: InMemoryStudentListsRepository
let routeListsRepository: InMemoryRouteListsRepository
let sut: ExitListUseCase

describe('Exit list use case', () => {
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
    sut = new ExitListUseCase(studentListsRepository, routeListsRepository)
  })

  it('should be able for student user to exit list', async () => {
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))
    await studentListsRepository.create(
      makeStudentList({ userId: 'user-01', listId: 'route-list-01' }),
    )
    await studentListsRepository.create(
      makeStudentList({ userId: 'user-02', listId: 'route-list-01' }),
    )
    expect(studentListsRepository.studentLists).toHaveLength(2)

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(studentListsRepository.studentLists).toHaveLength(1)
  })

  it('should not be able to exit a non-existent list', async () => {
    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to exit list if it is closed', async () => {
    await routeListsRepository.create(
      makeRouteList({ open: false }, 'route-list-01'),
    )
    await studentListsRepository.create(
      makeStudentList({ userId: 'user-01', listId: 'route-list-01' }),
    )

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible for a user to leave a list that they are not', async () => {
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))
    await studentListsRepository.create(
      makeStudentList({ userId: 'user-01', listId: 'route-list-01' }),
    )

    const result = await sut.execute({
      userId: 'user-02',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotOnListError)
  })
})
