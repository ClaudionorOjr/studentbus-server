import { inject, injectable } from 'tsyringe'
import { Responsible } from '@account/enterprise/entities/responsible'
import { ResponsiblesRepository } from '@account/application/repositories/responsibles-repository'
import { PrismaResponsibleMapper } from '../mappers/prisma-responsible-mapper'
import { PrismaService } from '..'

@injectable()
export class PrismaResponsiblesRepository implements ResponsiblesRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(responsible: Responsible): Promise<void> {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await this.prisma.responsible.create({
      data,
    })
  }

  async findByStudentId(studentId: string): Promise<Responsible | null> {
    const student = await this.prisma.responsible.findFirst({
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

    await this.prisma.responsible.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
