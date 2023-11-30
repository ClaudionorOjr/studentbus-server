import { StudentsRepository } from '@account/application/repositories/students-repository'
import { Student } from '@account/enterprise/entities/student'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaClient } from '@prisma/client'
import { getPrisma } from '..'

let prisma: PrismaClient

export class PrismaStudentsRepository implements StudentsRepository {
  constructor() {
    console.log('PrismaStudentsRepository: ' + process.env.DATABASE_URL)
    if (!prisma) {
      prisma = getPrisma()
    }
  }

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
