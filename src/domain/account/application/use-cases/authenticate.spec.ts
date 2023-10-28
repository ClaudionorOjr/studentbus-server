import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { hash } from 'bcryptjs'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

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
      await makeUser({
        email: 'user@example.com',
        passwordHash: await fakeHasher.hash('123456'),
      }),
    )

    const { accessToken } = await sut.execute({
      email: 'user@example.com',
      password: '123456',
    })

    expect(accessToken).toEqual(expect.any(String))
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
