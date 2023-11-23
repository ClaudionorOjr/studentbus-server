import { Student } from '@account/enterprise/entities/student'
import { Prisma, Student as RawStudent } from '@prisma/client'

export class PrismaStudentMapper {
  static toPrisma(student: Student): Prisma.StudentUncheckedCreateInput {
    return {
      userId: student.id,
      birthdate: student.birthdate,
      validatedAt: student.validatedAt,
    }
  }

  static toDomain(raw: RawStudent): Student {
    return Student.create(
      {
        birthdate: raw.birthdate,
        validatedAt: raw.validatedAt,
      },
      raw.userId,
    )
  }
}
