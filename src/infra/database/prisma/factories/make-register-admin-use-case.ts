import { RegisterAdminUseCase } from '@account/application/use-cases/register-admin'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

export function makeRegisterAdminUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hasher = new BcryptHasher()
  const registerAdminUseCase = new RegisterAdminUseCase(usersRepository, hasher)

  return registerAdminUseCase
}
