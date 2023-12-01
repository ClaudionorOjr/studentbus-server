import { UsersRepository } from '@account/application/repositories/users-repository'
import { User } from '@core/entities/user'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaClient } from '@prisma/client'
import { getPrisma } from '..'

let prisma: PrismaClient

export class PrismaUsersRepository implements UsersRepository {
  constructor() {
    if (!prisma) {
      prisma = getPrisma()
    }
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await prisma.user.create({
      data,
    })
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
