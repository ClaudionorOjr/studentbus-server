import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let usersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    sut = new AuthenticateUseCase(usersRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate an user', async () => {
    await usersRepository.create(
      makeUser({
        email: 'user@example.com',
        passwordHash: await fakeHasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'user@example.com',
      password: '123456',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({ accessToken: expect.any(String) })
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'user@example.com',
      password: '123546',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create(
      makeUser({
        email: 'user@example.com',
        passwordHash: await fakeHasher.hash('123458'),
      }),
    )

    const result = await sut.execute({
      email: 'user@example.com',
      password: '123546',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
