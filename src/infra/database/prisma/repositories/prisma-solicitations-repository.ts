import { SolicitationsRepository } from '@account/application/repositories/solicitations-repository'
import { Solicitation } from '@account/enterprise/entities/solicitation'
import { getPrisma } from '..'
import { PrismaSolicitationMapper } from '../mappers/prisma-solicitatiton-mapper'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export class PrismaSolicitatitonsRepository implements SolicitationsRepository {
  constructor() {
    // * Carregue o prisma apenas quando a classe for instanciada, para que assim utilize o schema randômico para os testes e2e.
    if (!prisma) {
      prisma = getPrisma()
    }
  }

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
