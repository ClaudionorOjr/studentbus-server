import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { Bond } from '@institutional/enterprise/entities/bond'

export function makeBond(override: Partial<Bond> = {}, id?: string) {
  const bond = Bond.create(
    {
      userId: randomUUID(),
      course: faker.person.fullName(),
      institutionId: randomUUID(),
      period: '1',
      turn: 'MORNING',
      weekdays: ['MONDAY', 'FRIDAY'],
      ...override,
    },
    id,
  )

  return bond
}
