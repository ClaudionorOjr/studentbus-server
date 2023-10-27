import { beforeEach, describe, expect, it } from 'vitest'
import { AlterPasswordUseCase } from './alter-password'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { hash, compare } from 'bcryptjs'
import { makeUser } from 'test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: AlterPasswordUseCase

describe('Alter password use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AlterPasswordUseCase(usersRepository)
  })

  it('should be able to alter user password', async () => {
    await usersRepository.create(
      await makeUser(
        {
          passwordHash: await hash('123456', 6),
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

    const isNewPasswordHashed = await compare('123123', newPasswordHash!)

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
    const user = await makeUser(
      {
        passwordHash: await hash('123456', 6),
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
