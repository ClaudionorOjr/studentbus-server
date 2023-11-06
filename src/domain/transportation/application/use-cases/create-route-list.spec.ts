import { beforeEach, describe, expect, it } from 'vitest'
import { CreateRouteListUseCase } from './create-route-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeUser } from 'test/factories/make-user'
import { makeInstitution } from 'test/factories/make-institution'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'

let usersRepository: InMemoryUsersRepository
let institutiosRepository: InMemoryInstitutionsRepository
let routeListsRepository: InMemoryRouteListsRepository
let sut: CreateRouteListUseCase

describe('Create route list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    institutiosRepository = new InMemoryInstitutionsRepository()
    routeListsRepository = new InMemoryRouteListsRepository()
    sut = new CreateRouteListUseCase(
      usersRepository,
      institutiosRepository,
      routeListsRepository,
    )
  })

  it('should be able to create a route list', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))
    await institutiosRepository.create(
      makeInstitution({ name: 'UERN' }, 'institution-01'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UFERSA' }, 'institution-02'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UNINASSAU' }, 'institution-03'),
    )

    await sut.execute({
      userId: 'user-01',
      departureTime: '17:30',
      returnTime: '22:00',
      turn: 'MORNING',
      capacity: 45,
      institutions: ['UERN', 'UFERSA'],
    })

    // expect.arrayContaining([expect.any(String)]) ou expect.any(Array<string>)
    expect(routeListsRepository.routeLists).toHaveLength(1)
    expect(routeListsRepository.routeLists).toEqual([
      expect.objectContaining({
        institutions: ['UERN', 'UFERSA'],
      }),
    ])
  })

  it('should not be able a non-driver user to create a route list', async () => {
    await usersRepository.create(makeUser({ rule: 'STUDENT' }, 'user-01'))

    await institutiosRepository.create(
      makeInstitution({ name: 'UERN' }, 'institution-01'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UFERSA' }, 'institution-02'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UNINASSAU' }, 'institution-03'),
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        departureTime: '17:30',
        returnTime: '22:00',
        turn: 'MORNING',
        capacity: 45,
        institutions: ['UERN', 'UFERSA'],
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a route list with an unregistered institution', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))
    await institutiosRepository.create(
      makeInstitution({ name: 'UERN' }, 'institution-01'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UFERSA' }, 'institution-02'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UNINASSAU' }, 'institution-03'),
    )

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        departureTime: '17:30',
        returnTime: '22:00',
        turn: 'MORNING',
        capacity: 45,
        institutions: ['IFRN', 'UERN', 'UFERSA'],
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
