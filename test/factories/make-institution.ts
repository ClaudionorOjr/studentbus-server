import { faker } from '@faker-js/faker'
import {
  Institution,
  InstitutionProps,
} from 'src/domain/institutional/enterprise/entities/institution'

export function makeInstitution(
  override: Partial<InstitutionProps> = {},
  id?: string,
) {
  const institution = Institution.create(
    {
      name: faker.company.name(),
      ...override,
    },
    id,
  )

  return institution
}
