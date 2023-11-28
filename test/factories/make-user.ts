import { Responsible } from '@account/enterprise/entities/responsible'
import { Student } from '@account/enterprise/entities/student'
import { User, UserProps } from '@core/entities/user'
import { faker } from '@faker-js/faker'
import { PrismaUserMapper } from '@infra/database/prisma/mappers/prisma-user-mapper'
import { randomUUID } from 'node:crypto'
import { databaseE2ETests } from 'prisma/vitest-environment-prisma/setup-e2e'

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

/**
 * Creates a new Prisma User with the given data.
 *
 * @param {Partial<UserProps>} data - The data to be used for creating the user. Defaults to an empty object.
 * @return {Promise<User>} - A promise that resolves with the created user.
 */
export async function makePrismaUser(
  data: Partial<UserProps> = {},
): Promise<User> {
  const user = makeUser(data)

  await databaseE2ETests.user.create({
    data: PrismaUserMapper.toPrisma(user),
  })

  return user
}

export function makeStudent(override: Partial<Student> = {}, id: string) {
  const student = Student.create(
    {
      birthdate: faker.date.recent(),
      ...override,
    },
    id,
  )

  return student
}

export function makeResponsible(
  override: Partial<Responsible> = {},
  id?: string,
) {
  const responsible = Responsible.create(
    {
      userId: randomUUID(),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return responsible
}
