import { faker } from '@faker-js/faker'
import {
  Responsible,
  ResponsibleProps,
} from '@account/enterprise/entities/responsible'
import { randomUUID } from 'node:crypto'
import { PrismaResponsibleMapper } from '@infra/database/prisma/mappers/prisma-responsible-mapper'
import { PrismaClient } from '@prisma/client'

export function makeResponsible(
  override: Partial<ResponsibleProps> = {},
  id?: string,
): Responsible {
  const responsible = Responsible.create(
    {
      studentId: randomUUID(),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return responsible
}

export class ResponsibleFactory {
  constructor(private prisma: PrismaClient) {}
  async makePrismaResponsible(
    data: Partial<ResponsibleProps> = {},
    id?: string,
  ) {
    const responsible = makeResponsible(data, id)

    await this.prisma.responsible.create({
      data: PrismaResponsibleMapper.toPrisma(responsible),
    })

    return responsible
  }
}
