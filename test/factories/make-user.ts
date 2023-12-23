import { Student, StudentProps } from '@account/enterprise/entities/student'
import { User, UserProps } from '@core/entities/user'
import { faker } from '@faker-js/faker'
import { PrismaUserMapper } from '@infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaClient } from '@prisma/client'

/**
 * Generates a user object with optional overrides and an optional ID.
 *
 * @param {Partial<UserProps>} override - An object containing optional properties to override the default values of the user object.
 * @param {string} id - An optional string representing the ID of the user.
 * @return {User} - A user object with the specified overrides and ID.
 */
export function makeUser(override: Partial<UserProps> = {}, id?: string): User {
  const user = User.create(
    {
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      phone: faker.phone.number(),
      role: 'STUDENT',
      ...override,
    },
    id,
  )

  return user
}

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: string,
): Student {
  const user = makeUser(override, id)

  const student = Student.create(
    {
      completeName: user.completeName,
      email: user.email,
      passwordHash: user.passwordHash,
      phone: user.phone,
      birthdate: faker.date.recent(),
      ...override,
    },
    user.id,
  )

  return student
}

export class UserFactory {
  constructor(private prisma: PrismaClient) {}
  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }

  async makePrismaStudent(
    data: Partial<StudentProps> = {},
    id?: string,
  ): Promise<Student> {
    const student = makeStudent(data, id)
    const user = PrismaUserMapper.toUser(student)

    await this.prisma.user.create({
      data: {
        ...PrismaUserMapper.toPrisma(user),
        students: {
          create: {
            birthdate: student.birthdate,
            validatedAt: student.validatedAt,
          },
        },
      },
    })

    return student
  }
}
