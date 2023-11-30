import { RegisterStudentUseCase } from '@account/application/use-cases/register-student'
import { PrismaSolicitatitonsRepository } from '../repositories/prisma-solicitations-repository'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { PrismaStudentsRepository } from '../repositories/prisma-students-repository'
import { PrismaResponsiblesRepository } from '../repositories/prisma-responsibles-repository'

export function makeRegisterStudentUseCase() {
  // ! Remover console.log
  console.log('make register student: ' + process.env.DATABASE_URL)
  const solicitationsRepository = new PrismaSolicitatitonsRepository()
  const usersRepository = new PrismaUsersRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const responsiblesRepository = new PrismaResponsiblesRepository()

  const registerStudentUseCase = new RegisterStudentUseCase(
    solicitationsRepository,
    usersRepository,
    studentsRepository,
    responsiblesRepository,
  )
  return registerStudentUseCase
}
