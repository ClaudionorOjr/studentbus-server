import { SolicitationsRepository } from '@account/application/repositories/solicitations-repository'
import { Solicitation } from '@account/enterprise/entities/solicitation'
import { prisma } from '../prisma'
import { PrismaSolicitationMapper } from '../mappers/prisma-solicitatiton-mapper'

export class PrismaSolicitatitonsRepository implements SolicitationsRepository {
  async create(solicitation: Solicitation): Promise<void> {
    const data = PrismaSolicitationMapper.toPrisma(solicitation)

    await prisma.solicitation.create({
      data,
    })
  }

  async findById(id: string): Promise<Solicitation | null> {
    const solicication = await prisma.solicitation.findUnique({
      where: {
        id,
      },
    })

    if (!solicication) {
      return null
    }

    return PrismaSolicitationMapper.toDomain(solicication)
  }

  async list(): Promise<Solicitation[]> {
    const solicitations = await prisma.solicitation.findMany()

    return solicitations.map(PrismaSolicitationMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await prisma.solicitation.delete({
      where: {
        id,
      },
    })
  }
}
