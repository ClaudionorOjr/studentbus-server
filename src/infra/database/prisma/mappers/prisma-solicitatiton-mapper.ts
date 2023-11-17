import { Solicitation } from '@account/enterprise/entities/solicitation'
import { Solicitation as RawSolcitation, Prisma } from '@prisma/client'

// TODO Alter de birthdate para birthdate
export class PrismaSolicitationMapper {
  static toPrisma(
    solicication: Solicitation,
  ): Prisma.SolicitationUncheckedCreateInput {
    return {
      id: solicication.id,
      completeName: solicication.completeName,
      email: solicication.email,
      password: solicication.passwordHash,
      phone: solicication.phone,
      birthdate: solicication.birthdate,
      responsibleName: solicication.responsibleName,
      responsiblePhone: solicication.responsiblePhone,
      degreeOfKinship: solicication.degreeOfKinship,
      note: solicication.note,
      status: solicication.status,
      createdAt: solicication.createdAt,
    }
  }

  static toDomain(raw: RawSolcitation): Solicitation {
    return Solicitation.create(
      {
        completeName: raw.completeName,
        email: raw.email,
        passwordHash: raw.password,
        phone: raw.phone,
        birthdate: raw.birthdate,
        responsibleName: raw.responsibleName,
        responsiblePhone: raw.responsiblePhone,
        degreeOfKinship: raw.degreeOfKinship,
        note: raw.note,
        status: raw.status,
        createdAt: raw.createdAt,
      },
      raw.id,
    )
  }
}
