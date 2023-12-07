import { inject, injectable } from 'tsyringe'
import { Solicitation } from '@account/enterprise/entities/solicitation'
import { SolicitationsRepository } from '@account/application/repositories/solicitations-repository'
import { PrismaSolicitationMapper } from '../mappers/prisma-solicitatiton-mapper'
import { PrismaService } from '..'

@injectable()
export class PrismaSolicitatitonsRepository implements SolicitationsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(solicitation: Solicitation): Promise<void> {
    const data = PrismaSolicitationMapper.toPrisma(solicitation)

    await this.prisma.solicitation.create({
      data,
    })
  }

  async findById(id: string): Promise<Solicitation | null> {
    const solicication = await this.prisma.solicitation.findUnique({
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
    const solicitations = await this.prisma.solicitation.findMany()

    return solicitations.map(PrismaSolicitationMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.solicitation.delete({
      where: {
        id,
      },
    })
  }
}
