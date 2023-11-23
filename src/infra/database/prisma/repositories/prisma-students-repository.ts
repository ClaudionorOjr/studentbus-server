import { StudentsRepository } from '@account/application/repositories/students-repository'
import { Student } from '@account/enterprise/entities/student'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { prisma } from '../prisma'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

export class PrismaStudentsRepository implements StudentsRepository {
  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await prisma.student.create({
      data,
    })
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async getProfile(userId: string): Promise<StudentProfile | null> {
    throw new Error('Method not implemented.')
  }

  async save(student: Student): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
