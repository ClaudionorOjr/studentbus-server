import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

config({ path: '.env', override: true })
const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  // ? Diferente do 'dev', o 'deploy' vai somente rodar as migrations, sem verificar o schema e gerar novas migrations
  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  // ? Necessário ser o executeRawUnsafe, pq esta é uma ação perigosa, onde vai deletar um schema do banco
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)

  await prisma.$disconnect()
})
