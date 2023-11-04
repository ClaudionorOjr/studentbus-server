import { beforeEach, describe, expect, it } from 'vitest'
import { ExitListUseCase } from './exit-list'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeStudentList } from 'test/factories/make-student-list'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeRouteList } from 'test/factories/make-route-list'

let studentListsRepository: InMemoryStudentListsRepository
let routeListsRepository: InMemoryRouteListsRepository
let sut: ExitListUseCase

describe('Exit list use case', () => {
  beforeEach(() => {
    studentListsRepository = new InMemoryStudentListsRepository()
    routeListsRepository = new InMemoryRouteListsRepository()
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

    await sut.execute({ userId: 'user-01', listId: 'route-list-01' })

    expect(studentListsRepository.studentLists).toHaveLength(1)
  })

  it('should not be able to exit list if it is closed', async () => {
    await routeListsRepository.create(
      makeRouteList({ open: false }, 'route-list-01'),
    )
    await studentListsRepository.create(
      makeStudentList({ userId: 'user-01', listId: 'route-list-01' }),
    )

    await expect(() =>
      sut.execute({ userId: 'user-01', listId: 'route-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible for a user to leave a list that they are not', async () => {
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))
    await studentListsRepository.create(
      makeStudentList({ userId: 'user-01', listId: 'route-list-01' }),
    )

    await expect(() =>
      sut.execute({ userId: 'user-02', listId: 'route-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
