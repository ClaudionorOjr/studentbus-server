import { StudentProfileUseCase } from '@account/application/use-cases/student-profile'
import { PrismaStudentsRepository } from '../repositories/prisma-students-repository'

export function makeStudentProfileUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const studentProfileUseCase = new StudentProfileUseCase(studentsRepository)

  return studentProfileUseCase
}
