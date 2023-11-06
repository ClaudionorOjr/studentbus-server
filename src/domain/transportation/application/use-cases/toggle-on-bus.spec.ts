import { beforeEach, describe, expect, it } from 'vitest'
import { ToggleOnBusUseCase } from './toggle-on-bus'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeStudentList } from 'test/factories/make-student-list'
import { makeRouteList } from 'test/factories/make-route-list'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: ToggleOnBusUseCase

describe('toggle on bus use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    studentListsRepository = new InMemoryStudentListsRepository()
    routeListsRepository = new InMemoryRouteListsRepository(
      studentListsRepository,
    )
    sut = new ToggleOnBusUseCase(
      usersRepository,
      routeListsRepository,
      studentListsRepository,
    )
  })

  it('should be able to toggle "on bus" information', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await studentListsRepository.create(
      makeStudentList(
        { userId: 'user-01', listId: 'route-list-01' },
        'student-list-01',
      ),
    )

    await sut.execute({ userId: 'user-01', studentListId: 'student-list-01' })

    expect(studentListsRepository.studentLists).toHaveLength(1)
    expect(studentListsRepository.studentLists).toEqual(
      expect.arrayContaining([expect.objectContaining({ onBus: true })]),
    )
  })

  it('should not be able to toggle "on bus" information to another user', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await usersRepository.create(makeUser({}, 'user-02'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await studentListsRepository.create(
      makeStudentList(
        { userId: 'user-01', listId: 'route-list-01' },
        'student-list-01',
      ),
    )

    await expect(() =>
      sut.execute({ userId: 'user-02', studentListId: 'student-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to toggle "on bus" information it user do not come back', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await studentListsRepository.create(
      makeStudentList(
        { userId: 'user-01', listId: 'route-list-01', comeBack: false },
        'student-list-01',
      ),
    )

    await expect(() =>
      sut.execute({ userId: 'user-01', studentListId: 'student-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to toggle "on bus" information of a closed route list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))

    await routeListsRepository.create(
      makeRouteList({ open: false }, 'route-list-01'),
    )

    await studentListsRepository.create(
      makeStudentList(
        { userId: 'user-01', listId: 'route-list-01' },
        'student-list-01',
      ),
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        studentListId: 'student-list-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
