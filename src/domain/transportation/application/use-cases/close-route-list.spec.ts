import { beforeEach, describe, expect, it } from 'vitest'
import { CloseRouteList } from './close-route-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeRouteList } from 'test/factories/make-route-list'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: CloseRouteList

describe('Close route list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    studentListsRepository = new InMemoryStudentListsRepository()

    routeListsRepository = new InMemoryRouteListsRepository(
      studentListsRepository,
    )
    sut = new CloseRouteList(usersRepository, routeListsRepository)
  })

  it('should be able a driver user to close a route list', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))
    await routeListsRepository.create(
      makeRouteList({ userId: 'user-01' }, 'route-list-01'),
    )

    expect(routeListsRepository.routeLists[0].open).toBeTruthy()

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(routeListsRepository.routeLists[0].open).toBeFalsy()
  })

  it('should not be able a non-driver user to close a route list', async () => {
    await usersRepository.create(makeUser({ rule: 'STUDENT' }, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to close a non-existent route list', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to close a route list created by another driver', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))
    await routeListsRepository.create(
      makeRouteList({ userId: 'user-02' }, 'route-list-01'),
    )

    const result = await sut.execute({
      userId: 'user-01',
      routeListId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
