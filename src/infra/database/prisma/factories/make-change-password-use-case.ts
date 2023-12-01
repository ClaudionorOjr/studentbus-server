import { ChangePasswordUseCase } from '@account/application/use-cases/change-password'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

export function makeChangePasswordUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hasher = new BcryptHasher()
  const changePasswordUseCase = new ChangePasswordUseCase(
    usersRepository,
    hasher,
  )

  return changePasswordUseCase
}
