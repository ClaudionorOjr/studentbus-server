import { SignUpStudentUseCase } from '@account/application/use-cases/signup-student'
import { PrismaSolicitatitonsRepository } from '../repositories/prisma-solicitations-repository'
import { BcryptHasher } from 'src/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'

export function makeSignupStudentUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const hasher = new BcryptHasher()
  const solicitationsRepository = new PrismaSolicitatitonsRepository()

  const signUpStudentUseCase = new SignUpStudentUseCase(
    usersRepository,
    hasher,
    solicitationsRepository,
  )

  return signUpStudentUseCase
}
