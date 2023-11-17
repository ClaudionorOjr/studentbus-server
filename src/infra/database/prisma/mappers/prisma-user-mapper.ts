import { User } from '@core/entities/user'
import { User as RawUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {
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
