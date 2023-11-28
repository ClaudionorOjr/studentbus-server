import { Student } from '@account/enterprise/entities/student'
import { Prisma, Student as RawStudent } from '@prisma/client'

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
   * @returns {Student} - The converted `Student` domain object.
   */
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
