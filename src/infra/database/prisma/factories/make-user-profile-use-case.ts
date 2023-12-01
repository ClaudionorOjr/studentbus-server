import { UserProfileUseCase } from '@account/application/use-cases/user-profile'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'

export function makeUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const userProfileUseCase = new UserProfileUseCase(usersRepository)

  return userProfileUseCase
}
