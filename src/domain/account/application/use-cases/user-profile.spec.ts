import { describe, beforeEach, expect, it } from 'vitest'
import { UserProfileUseCase } from './user-profile'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

let usersRepository: InMemoryUsersRepository
let sut: UserProfileUseCase

describe('User profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserProfileUseCase(usersRepository)
  })

  it('should be able to show the user profile', async () => {
    await usersRepository.create(makeUser({ role: 'DRIVER' }, 'user-01'))
    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      user: expect.objectContaining({ id: 'user-01' }),
    })
  })

  it('should not be able to show non-existent user profile', async () => {
    const result = await sut.execute({ userId: 'user-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })
})
