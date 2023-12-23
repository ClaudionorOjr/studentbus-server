import { FastifyInstance } from 'fastify'

import { accountRoutes } from './account.routes'

export async function routes(app: FastifyInstance) {
  // TODO: Reorganizar rotas!
  app.register(accountRoutes)
}
