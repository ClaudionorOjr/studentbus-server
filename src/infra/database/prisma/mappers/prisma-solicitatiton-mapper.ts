import { Solicitation } from '@account/enterprise/entities/solicitation'
import { Solicitation as RawSolicitation, Prisma } from '@prisma/client'

// TODO Alter de birthdate para birthdate
export class PrismaSolicitationMapper {
  /**
   * Converts a `Solicitation` object to a `Prisma.SolicitationUncheckedCreateInput` object.
   *
   * @param {Solicitation} solicitation - The `Solicitation` object to convert.
   * @return {Prisma.SolicitationUncheckedCreateInput} The converted `Prisma.SolicitationUncheckedCreateInput` object.
   */
  static toPrisma(
    solicitation: Solicitation,
  ): Prisma.SolicitationUncheckedCreateInput {
    return {
      id: solicitation.id,
      completeName: solicitation.completeName,
      email: solicitation.email,
      password: solicitation.passwordHash,
      phone: solicitation.phone,
      birthdate: solicitation.birthdate,
      responsibleName: solicitation.responsibleName,
      responsiblePhone: solicitation.responsiblePhone,
      degreeOfKinship: solicitation.degreeOfKinship,
      note: solicitation.note,
      status: solicitation.status,
      createdAt: solicitation.createdAt,
    }
  }

  /**
   * Converts a Prisma raw solicitation object to a domain `Solicitation` object.
   *
   * @param {RawSolicitation} raw - The Prisma raw solicitation object to be converted.
   * @return {Solicitation} - The converted `Solicitation` domain object.
   */
  static toDomain(raw: RawSolicitation): Solicitation {
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
