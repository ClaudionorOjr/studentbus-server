import { RegisterDriverUseCase } from '@account/application/use-cases/register-driver'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

export function makeRegisterDriverUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hasher = new BcryptHasher()
  const registerDriverUseCase = new RegisterDriverUseCase(
    usersRepository,
    hasher,
  )

  return registerDriverUseCase
}
