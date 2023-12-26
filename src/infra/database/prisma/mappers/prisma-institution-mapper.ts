import { Institution } from '@institutional/enterprise/entities/institution'
import { Prisma, Institution as RawInstitution } from '@prisma/client'

export class PrismaInstitutionMapper {
  /**
   * Convert an `Institution` object to a `Prisma.InstitutionUncheckedCreateInput` object.
   *
   * @param {Institution} institution - The `Institution` object to be converted.
   * @return {Prisma.InstitutionUncheckedCreateInput} - The converted `Prisma.ResponsibleUncheckedCreateInput` object.
   */
  static toPrisma(
    institution: Institution,
  ): Prisma.InstitutionUncheckedCreateInput {
    return {
      id: institution.id,
      name: institution.name,
    }
  }

  /**
   * Converts a Prisma raw institution object to a domain `Institution` object.
   *
   * @param {RawInstitution} raw - The Prisma raw institution object to be converted.
   * @return {Institution} - The converted domain `Institution` object.
   */
  static toDomain(raw: RawInstitution): Institution {
    return Institution.create(
      {
        name: raw.name,
      },
      raw.id,
    )
  }
}
