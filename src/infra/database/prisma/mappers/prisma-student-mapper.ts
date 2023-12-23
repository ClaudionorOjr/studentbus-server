import { Student } from '@account/enterprise/entities/student'
import { Prisma, User as RawUser, Student as RawStudent } from '@prisma/client'

type Raw = RawStudent & { user: RawUser }

export class PrismaStudentMapper {
  /**
   * Converts a `Student` object to a `Prisma.StudentUncheckedCreateInput` object.
   *
   * @param {Student} student - The `Student` object to convert.
   * @return {Prisma.StudentUncheckedCreateInput} - The converted `Prisma.StudentUncheckedCreateInput` object.
   */
  static toPrisma(student: Student): Prisma.StudentUncheckedCreateInput {
    return {
      userId: student.id,
      birthdate: student.birthdate,
      validatedAt: student.validatedAt,
    }
  }

  /**
   * Converts a Prisma raw student object to a `Student` domain object.
   *
   * @param {RawStudent} raw - The Prisma raw student object to be converted.
   * @return {Student} - The converted `Student` domain object.
   */
  static toDomain(raw: Raw): Student {
    return Student.create(
      {
        completeName: raw.user.completeName,
        email: raw.user.email,
        passwordHash: raw.user.password,
        phone: raw.user.phone,
        role: raw.user.role,
        createdAt: raw.user.createdAt,
        updatedAt: raw.user.updatedAt,
        birthdate: raw.birthdate,
        validatedAt: raw.validatedAt,
      },
      raw.userId,
    )
  }
}
