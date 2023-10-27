import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate an user', async () => {
    await usersRepository.create(
      await makeUser({
        email: 'user@example.com',
        passwordHash: await hash('123456', 8),
      }),
    )

    const { user } = await sut.execute({
      email: 'user@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() => {
      return sut.execute({
        email: 'user@example.com',
        password: '123546',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create(
      await makeUser({
        email: 'user@example.com',
        passwordHash: await hash('123458', 8),
      }),
    )

    await expect(() => {
      return sut.execute({
        email: 'admin@example.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
