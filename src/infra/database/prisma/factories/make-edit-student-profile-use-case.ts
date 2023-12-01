import { EditStudentProfileUseCase } from '@account/application/use-cases/edit-student-profile'
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { PrismaStudentsRepository } from '../repositories/prisma-students-repository'
import { PrismaResponsiblesRepository } from '../repositories/prisma-responsibles-repository'

export function makeEditStudentProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const responsiblesRepository = new PrismaResponsiblesRepository()
  const editStudentProfileUseCase = new EditStudentProfileUseCase(
    usersRepository,
    studentsRepository,
    responsiblesRepository,
  )

  return editStudentProfileUseCase
}
