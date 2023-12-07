import { DatabaseProvider } from '@infra/database/database-provider'
import { PrismaClient } from '@prisma/client'
import { injectable } from 'tsyringe'

// let prisma: PrismaClient

// export function getPrisma() {
//   if (!prisma) {
//     prisma = new PrismaClient({
//       log: ['warn', 'error', 'query'],
//     })
//   }

//   return prisma
// }

@injectable()
export class PrismaService extends PrismaClient implements DatabaseProvider {
  constructor() {
    super({
      log: ['warn', 'error', 'query'],
    })
  }

  onModuleInit() {
    return this.$connect
  }

  onModuleDestroy() {
    return this.$disconnect
  }
}
