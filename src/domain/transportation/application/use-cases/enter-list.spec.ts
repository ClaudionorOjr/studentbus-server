import { beforeEach, describe, expect, it } from 'vitest'
import { EnterListUseCase } from './enter-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { makeUser } from 'test/factories/make-user'
import { makeRouteList } from 'test/factories/make-route-list'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { UserAlreadyOnListError } from './errors/user-already-on-list-error'

let usersRepository: InMemoryUsersRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: EnterListUseCase

describe('Enter list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    studentListsRepository = new InMemoryStudentListsRepository()
    routeListsRepository = new InMemoryRouteListsRepository(
      studentListsRepository,
    )
    sut = new EnterListUseCase(
      usersRepository,
      routeListsRepository,
      studentListsRepository,
    )
  })

  it('should be able for student user to enter list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(studentListsRepository.studentLists).toHaveLength(1)
    expect(studentListsRepository.studentLists[0]).toEqual(
      expect.objectContaining({ comeBack: true, onBus: false }),
    )
  })

  it('should not be able for non-student user to enter list', async () => {
    await usersRepository.create(makeUser({ rule: 'DRIVER' }, 'user-01'))

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to join a non-existent list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able for a user to join a list that is already on the list', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await routeListsRepository.create(makeRouteList({}, 'route-list-01'))

    await sut.execute({ userId: 'user-01', listId: 'route-list-01' })

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyOnListError)
  })

  it('should not be able to join a list if it is closed', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await routeListsRepository.create(
      makeRouteList({ open: false }, 'route-list-01'),
    )

    const result = await sut.execute({
      userId: 'user-01',
      listId: 'route-list-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
