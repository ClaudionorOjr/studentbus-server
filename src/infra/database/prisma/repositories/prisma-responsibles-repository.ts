import { ResponsiblesRepository } from '@account/application/repositories/responsibles-repository'
import { Responsible } from '@account/enterprise/entities/responsible'
import { PrismaResponsibleMapper } from '../mappers/prisma-responsible-mapper'
import { getPrisma } from '..'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export class PrismaResponsiblesRepository implements ResponsiblesRepository {
  constructor() {
    console.log('PrismaResponsiblessRepository: ' + process.env.DATABASE_URL)
    if (!prisma) {
      prisma = getPrisma()
    }
  }

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
