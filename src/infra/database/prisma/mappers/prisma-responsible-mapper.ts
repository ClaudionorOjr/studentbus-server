import { Responsible } from '@account/enterprise/entities/responsible'
import { Prisma, Responsible as RawResponsible } from '@prisma/client'

export class PrismaResponsibleMapper {
  static toPrisma(
    responsible: Responsible,
  ): Prisma.ResponsibleUncheckedCreateInput {
    return {
      id: responsible.id,
      userId: responsible.userId,
      name: responsible.responsibleName,
      phone: responsible.responsiblePhone,
      degreeOfKinship: responsible.degreeOfKinship,
    }
  }

  static toDomain(raw: RawResponsible): Responsible {
    return Responsible.create(
      {
        userId: raw.userId,
        responsibleName: raw.name,
        responsiblePhone: raw.phone,
        degreeOfKinship: raw.degreeOfKinship,
      },
      raw.id,
    )
  }
}
