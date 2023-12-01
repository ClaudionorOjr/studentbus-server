import { StudentsRepository } from '@account/application/repositories/students-repository'
import { Student } from '@account/enterprise/entities/student'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaClient } from '@prisma/client'
import { getPrisma } from '..'

let prisma: PrismaClient

export class PrismaStudentsRepository implements StudentsRepository {
  constructor() {
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
    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    })
    const responsible = await prisma.responsible.findFirst({
      where: {
        userId,
      },
    })

    if (!student) {
      return null
    }

    return StudentProfile.create({
      userId,
      completeName: student.user.completeName,
      email: student.user.email,
      phone: student.user.phone,
      birthdate: student.birthdate,
      responsibleName: responsible?.name,
      responsiblePhone: responsible?.phone,
      degreeOfKinship: responsible?.degreeOfKinship,
    })
  }

  async save(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await prisma.student.update({
      where: {
        userId: data.userId,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.student.delete({
      where: {
        userId: id,
      },
    })
  }
}
