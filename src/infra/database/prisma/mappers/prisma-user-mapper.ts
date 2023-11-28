import { User } from '@core/entities/user'
import { User as RawUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {
  /**
   * Converts a `User` object to a `Prisma.UserUncheckedCreateInput` object.
   *
   * @param {User} user - The `User` object to convert.
   * @return {Prisma.UserUncheckedCreateInput} - The converted `Prisma.UserUncheckedCreateInput` object.
   */
  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id,
      completeName: user.completeName,
      email: user.email,
      password: user.passwordHash,
      phone: user.phone,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    }
  }

  /**
   * Converts a Prisma raw user object to a `User` domain object.
   *
   * @param {RawUser} raw - The Prisma raw user object to be converted.
   * @return {User} - The converted `User` domain object.
   */
  static toDomain(raw: RawUser): User {
    return User.create(
      {
        completeName: raw.completeName,
        email: raw.email,
        passwordHash: raw.password,
        phone: raw.phone,
        role: raw.role,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }
}
