import {
  Solicitation,
  SolicitationProps,
} from '@account/enterprise/entities/solicitation'
import { faker } from '@faker-js/faker'
import { PrismaSolicitationMapper } from '@infra/database/prisma/mappers/prisma-solicitatiton-mapper'
import { PrismaClient } from '@prisma/client'

/**
 * Creates a solicitation with optional overrides and an optional ID.
 *
 * @param {Partial<SolicitationProps>} override - Optional overrides for the solicitation properties.
 * @param {string} id - Optional ID for the solicitation.
 * @return {Solicitation} The created solicitation.
 */
export function makeSolicitation(
  override: Partial<SolicitationProps> = {},
  id?: string,
): Solicitation {
  const solicitation = Solicitation.create(
    {
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      phone: faker.phone.number(),
      birthdate: faker.date.recent(),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return solicitation
}

export class SolicitationFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaSolicitation(
    data: Partial<SolicitationProps> = {},
  ): Promise<Solicitation> {
    const solicitation = makeSolicitation(data)

    await this.prisma.solicitation.create({
      data: PrismaSolicitationMapper.toPrisma(solicitation),
    })

    return solicitation
  }
}
