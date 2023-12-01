import { ResponsiblesRepository } from '@account/application/repositories/responsibles-repository'
import { Responsible } from '@account/enterprise/entities/responsible'
import { PrismaResponsibleMapper } from '../mappers/prisma-responsible-mapper'
import { getPrisma } from '..'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export class PrismaResponsiblesRepository implements ResponsiblesRepository {
  constructor() {
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
    const student = await prisma.responsible.findFirst({
      where: {
        userId: studentId,
      },
    })

    if (!student) {
      return null
    }

    return PrismaResponsibleMapper.toDomain(student)
  }

  async save(responsible: Responsible): Promise<void> {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await prisma.responsible.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
