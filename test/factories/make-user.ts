import { Responsible } from '@account/enterprise/entities/responsible'
import { Student } from '@account/enterprise/entities/student'
import { User } from '@core/entities/user'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

export function makeUser(override: Partial<User> = {}, id?: string) {
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

export function makeStudent(override: Partial<Student> = {}, id?: string) {
  const student = Student.create(
    {
      userId: randomUUID(),
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
