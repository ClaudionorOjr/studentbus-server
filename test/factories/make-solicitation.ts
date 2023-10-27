import { Solicitation } from '@account/enterprise/entities/solicitation'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

export async function makeSolicitation(
  override: Partial<Solicitation> = {},
  id?: string,
) {
  const solicitation = Solicitation.create(
    {
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: await hash(faker.string.alphanumeric(6), 8),
      phone: faker.phone.number(),
      dateOfBirth: faker.date.recent(),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return solicitation
}
