import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteRouteListUseCase } from './delete-route-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeRouteList } from 'test/factories/make-route-list'
import { makeStudentList } from 'test/factories/make-student-list'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: DeleteRouteListUseCase

describe('Delete route list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    studentListsRepository = new InMemoryStudentListsRepository()
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

    await sut.execute({ userId: 'user-01', routeListId: 'route-list-01' })
    expect(routeListsRepository.routeLists).toHaveLength(0)
    expect(studentListsRepository.studentLists).toHaveLength(0)
  })
})
