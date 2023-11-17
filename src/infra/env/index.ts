import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  COMPOSE_PROJECT_NAME: z.string().optional(),
  PORT: z.coerce.number().optional().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('❌ Invalid environment variables ', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
