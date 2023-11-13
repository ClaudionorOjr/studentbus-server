import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchStudentsOnListUseCase } from './fetch-students-on-list'
import { makeStudent, makeUser } from 'test/factories/make-user'
import { makeStudentList } from 'test/factories/make-student-list'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeRouteList } from 'test/factories/make-route-list'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentsRepository: InMemoryStudentsRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: FetchStudentsOnListUseCase

describe('Fetch students on list use case', () => {
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

    sut = new FetchStudentsOnListUseCase(
      usersRepository,
      routeListsRepository,
      studentListsRepository,
    )
  })

  it('should be able to fetch students on list', async () => {
    await Promise.all([
      usersRepository.create(makeUser({}, 'user-01')),
      studentsRepository.create(makeStudent({ userId: 'user-01' })),
      usersRepository.create(makeUser({}, 'user-02')),
      studentsRepository.create(makeStudent({ userId: 'user-02' })),
    ])

    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await Promise.all([
      studentListsRepository.create(
        makeStudentList({ userId: 'user-01', listId: 'route-list-01' }),
      ),
      studentListsRepository.create(
        makeStudentList({ userId: 'user-02', listId: 'route-list-01' }),
      ),
    ])

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      studentsOnList: expect.arrayContaining([
        expect.objectContaining({ userId: 'user-01' }),
        expect.objectContaining({ userId: 'user-02' }),
      ]),
    })

    // if (result.isSuccess()) {
    //   console.log(result.value.studentsOnList)
    // }
  })

  it('should not be able a non-existent user to fetch for students on list', async () => {
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })

  it('should not be able to fetch for students from a non-existent list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
