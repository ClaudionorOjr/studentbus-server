import { DeleteYourAccountUseCase } from '@account/application/use-cases/delete-your-account'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { PrismaStudentsRepository } from '../repositories/prisma-students-repository'

export function makeDeleteYourAccountUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const deleteYourAccountUseCase = new DeleteYourAccountUseCase(
    usersRepository,
    studentsRepository,
  )

  return deleteYourAccountUseCase
}
