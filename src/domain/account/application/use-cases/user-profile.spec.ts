import { describe, beforeEach, expect, it } from 'vitest'
import { UserProfileUseCase } from './user-profile'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: UserProfileUseCase

describe('User profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserProfileUseCase(usersRepository)
  })

  it('should be able to show the user profile', async () => {
    await usersRepository.create(await makeUser({ rule: 'DRIVER' }, 'user-01'))
    const { user } = await sut.execute({ userId: 'user-01' })

    console.log(user)
    expect(user.id).toEqual('user-01')
  })
})
