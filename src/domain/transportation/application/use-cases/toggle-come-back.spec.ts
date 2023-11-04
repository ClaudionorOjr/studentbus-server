import { beforeEach, describe, expect, it } from 'vitest'
import { ToggleComeBackUseCase } from './toggle-come-back'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeStudentList } from 'test/factories/make-student-list'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeRouteList } from 'test/factories/make-route-list'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: ToggleComeBackUseCase

describe('Toggle come back use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    routeListsRepository = new InMemoryRouteListsRepository()
    studentListsRepository = new InMemoryStudentListsRepository()
    sut = new ToggleComeBackUseCase(
      usersRepository,
      routeListsRepository,
      studentListsRepository,
    )
  })

  it('should be able to toggle "come back" information', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await usersRepository.create(makeUser({}, 'user-02'))

    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await studentListsRepository.create(
      makeStudentList(
        { userId: 'user-01', listId: 'route-list-01' },
        'student-list-01',
      ),
    )
    await studentListsRepository.create(
      makeStudentList(
        { userId: 'user-02', listId: 'route-list-01', comeBack: false },
        'student-list-02',
      ),
    )

    await sut.execute({
      userId: 'user-01',
      studentListId: 'student-list-01',
    })
    await sut.execute({
      userId: 'user-02',
      studentListId: 'student-list-02',
    })

    console.log(studentListsRepository.studentLists)
    expect(studentListsRepository.studentLists).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ comeBack: true }),
        expect.objectContaining({ comeBack: false }),
      ]),
    )
  })

  it('should not be able to toggle "come back" information to another user', async () => {
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
      sut.execute({
        userId: 'user-02',
        studentListId: 'student-list-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to toggle "come back" information of a closed route list', async () => {
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
