import { beforeEach, describe, expect, it } from 'vitest'
import { CloseRouteList } from './close-route-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeRouteList } from 'test/factories/make-route-list'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let sut: CloseRouteList

describe('Close route list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    routeListsRepository = new InMemoryRouteListsRepository()
    sut = new CloseRouteList(usersRepository, routeListsRepository)
  })

  it('should be able a driver user to close a route list', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))
    await routeListsRepository.create(
      makeRouteList({ userId: 'user-01' }, 'route-list-01'),
    )

    expect(routeListsRepository.routeLists[0].open).toBeTruthy()

    await sut.execute({ userId: 'user-01', routeListId: 'route-list-01' })

    expect(routeListsRepository.routeLists[0].open).toBeFalsy()
  })

  it('should not be able a non-driver user to close a route list', async () => {
    await usersRepository.create(makeUser({ rule: 'STUDENT' }, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await expect(() =>
      sut.execute({ userId: 'user-01', routeListId: 'route-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to close a non-existent route list', async () => {
    await usersRepository.create(makeUser({ rule: 'STUDENT' }, 'user-01'))

    await expect(() =>
      sut.execute({ userId: 'user-01', routeListId: 'route-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to close a route list created by another driver', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))
    await routeListsRepository.create(
      makeRouteList({ userId: 'user-02' }, 'route-list-01'),
    )

    await expect(() =>
      sut.execute({ userId: 'user-01', routeListId: 'route-list-01' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
