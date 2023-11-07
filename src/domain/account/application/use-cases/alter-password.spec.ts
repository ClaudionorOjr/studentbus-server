import { beforeEach, describe, expect, it } from 'vitest'
import { AlterPasswordUseCase } from './alter-password'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let usersRepository: InMemoryUsersRepository
let fakerHasher: FakeHasher
let sut: AlterPasswordUseCase

describe('Alter password use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakerHasher = new FakeHasher()
    sut = new AlterPasswordUseCase(usersRepository, fakerHasher)
  })

  it('should be able to alter user password', async () => {
    await usersRepository.create(
      makeUser(
        {
          passwordHash: await fakerHasher.hash('123456'),
        },
        'user-01',
      ),
    )

    const result = await sut.execute({
      userId: 'user-01',
      password: '123456',
      newPassword: '123123',
    })

    expect(result.isSuccess()).toBe(true)

    const newPasswordHash = usersRepository.users[0].passwordHash

    const isNewPasswordHashed = await fakerHasher.compare(
      '123123',
      newPasswordHash,
    )

    expect(isNewPasswordHashed).toBeTruthy()
  })

  it('should not be able to alter password a non-existing user', async () => {
    const result = await sut.execute({
      userId: 'user-01',
      password: '121212',
      newPassword: '122333',
    })

    expect(result.isFailure()).toBe(true)

    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })

  it('should not be able to alter password when wrong password is passed', async () => {
    const user = makeUser(
      {
        passwordHash: await fakerHasher.hash('123456'),
      },
      'user-01',
    )

    await usersRepository.create(user)

    const result = await sut.execute({
      userId: 'user-01',
      password: '121212',
      newPassword: '122333',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
