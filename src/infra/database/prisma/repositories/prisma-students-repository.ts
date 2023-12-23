import { inject, injectable } from 'tsyringe'
import { Student } from '@account/enterprise/entities/student'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { StudentsRepository } from '@account/application/repositories/students-repository'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '..'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

@injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(student: Student): Promise<void> {
    const user = PrismaUserMapper.toUser(student)
    const data = PrismaUserMapper.toPrisma(user)

    const { birthdate, validatedAt } = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data: {
        ...data,
        students: {
          create: { birthdate, validatedAt },
        },
      },
    })
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }

  async getProfile(userId: string): Promise<StudentProfile | null> {
    const student = await this.prisma.student.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    })

    const responsible = await this.prisma.responsible.findFirst({
      where: {
        studentId: userId,
      },
    })

    if (!student) {
      return null
    }

    return StudentProfile.create({
      studentId: student.userId,
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
    const user = PrismaUserMapper.toUser(student)
    const data = PrismaUserMapper.toPrisma(user)

    const { userId, birthdate, validatedAt } =
      PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
        students: {
          update: {
            where: {
              userId,
            },
            data: {
              birthdate,
              validatedAt,
            },
          },
        },
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
