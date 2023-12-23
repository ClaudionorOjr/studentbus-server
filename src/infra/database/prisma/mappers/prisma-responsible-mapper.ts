import { Responsible } from '@account/enterprise/entities/responsible'
import { Prisma, Responsible as RawResponsible } from '@prisma/client'

export class PrismaResponsibleMapper {
  /**
   * Converts a `Responsible` object to a `Prisma.ResponsibleUncheckedCreateInput` object.
   *
   * @param {Responsible} responsible - The `Responsible` object to convert.
   * @return {Prisma.ResponsibleUncheckedCreateInput} - The converted `Prisma.ResponsibleUncheckedCreateInput` object.
   */
  static toPrisma(
    responsible: Responsible,
  ): Prisma.ResponsibleUncheckedCreateInput {
    return {
      id: responsible.id,
      studentId: responsible.studentId,
      name: responsible.responsibleName,
      phone: responsible.responsiblePhone,
      degreeOfKinship: responsible.degreeOfKinship,
    }
  }

  /**
   * Converts a Prisma raw responsible object to a `Responsible` domain object.
   *
   * @param {RawResponsible} raw - The Prisma raw responsible object to be converted.
   * @returns {Responsible} - The converted `Responsible` domain object.
   */
  static toDomain(raw: RawResponsible): Responsible {
    return Responsible.create(
      {
        studentId: raw.studentId,
        responsibleName: raw.name,
        responsiblePhone: raw.phone,
        degreeOfKinship: raw.degreeOfKinship,
      },
      raw.id,
    )
  }
}
