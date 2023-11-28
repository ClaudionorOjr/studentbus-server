import { AuthenticateUseCase } from '@account/application/use-cases/authenticate'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hasher = new BcryptHasher()
  const jwtEncrypter = new JwtEncrypter()
  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    hasher,
    jwtEncrypter,
  )

  return authenticateUseCase
}
