import { FastifyInstance } from 'fastify'

import { accountRoutes } from './account.routes'
import { institutionRoutes } from './institution.routes'

export async function routes(app: FastifyInstance) {
  // TODO: Reorganizar rotas!
  app.register(accountRoutes)
  app.register(institutionRoutes)
}
