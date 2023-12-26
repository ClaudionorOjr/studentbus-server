import { PaginationParams } from '@core/repositories/pagination-params'
import { Institution } from '@institutional/enterprise/entities/institution'
import { InstitutionsRepository } from '@institutional/application/repositories/institutions-repository'
import { PrismaInstitutionMapper } from '../mappers/prisma-institution-mapper'
import { PrismaService } from '..'
import { inject, injectable } from 'tsyringe'

@injectable()
export class PrismaInstitutionsRepository implements InstitutionsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(institution: Institution): Promise<void> {
    const data = PrismaInstitutionMapper.toPrisma(institution)

    await this.prisma.institution.create({
      data,
    })
  }

  async findByName(name: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findUnique({
      where: {
        name,
      },
    })

    if (!institution) {
      return null
    }

    return PrismaInstitutionMapper.toDomain(institution)
  }

  async findById(id: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findUnique({
      where: {
        id,
      },
    })

    if (!institution) {
      return null
    }

    return PrismaInstitutionMapper.toDomain(institution)
  }

  async list({ page }: PaginationParams): Promise<Institution[]> {
    const institutions = await this.prisma.institution.findMany({
      take: 10,
      skip: (page - 1) * 10,
    })

    return institutions.map(PrismaInstitutionMapper.toDomain)
  }

  async save(institution: Institution): Promise<void> {
    const data = PrismaInstitutionMapper.toPrisma(institution)

    await this.prisma.institution.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.institution.delete({
      where: {
        id,
      },
    })
  }
}
