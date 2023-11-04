import { beforeEach, describe, expect, it } from 'vitest'
import { AlterPasswordUseCase } from './alter-password'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'

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

    await sut.execute({
      userId: 'user-01',
      password: '123456',
      newPassword: '123123',
    })

    const newPasswordHash = usersRepository.users[0].passwordHash

    const isNewPasswordHashed = await fakerHasher.compare(
      '123123',
      newPasswordHash,
    )

    expect(isNewPasswordHashed).toBeTruthy()
  })

  it('should not be able to alter password a non-existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        password: '121212',
        newPassword: '122333',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to alter password when wrong password is passed', async () => {
    const user = makeUser(
      {
        passwordHash: await fakerHasher.hash('123456'),
      },
      'user-01',
    )

    await usersRepository.create(user)

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        password: '121212',
        newPassword: '122333',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
