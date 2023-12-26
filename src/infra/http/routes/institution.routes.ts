import { FastifyInstance } from 'fastify'
import { registerInstitution } from '../controllers/register-institution-controller'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyRole } from '../middlewares/verify-role'

export async function institutionRoutes(app: FastifyInstance) {
  app.post(
    '/institutions/register',
    { onRequest: [verifyJWT, verifyRole('ADMIN')] },
    registerInstitution,
  )
}
