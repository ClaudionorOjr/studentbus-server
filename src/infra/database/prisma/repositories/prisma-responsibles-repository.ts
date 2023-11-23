import { ResponsiblesRepository } from '@account/application/repositories/responsibles-repository'
import { Responsible } from '@account/enterprise/entities/responsible'
import { PrismaResponsibleMapper } from '../mappers/prisma-responsible-mapper'
import { prisma } from '../prisma'

export class PrismaResponsiblesRepository implements ResponsiblesRepository {
  async create(responsible: Responsible): Promise<void> {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await prisma.responsible.create({
      data,
    })
  }

  async findByStudentId(studentId: string): Promise<Responsible | null> {
    throw new Error('Method not implemented.')
  }

  async save(responsible: Responsible): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
