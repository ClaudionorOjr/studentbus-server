import { FastifyInstance } from 'fastify'
import { signUpStudent } from './signup-student-controller'
import { registerStudent } from './register-student-controller'
import { registerDriver } from './register-driver-controller'
import { registerAdmin } from './register-admin-controller'
import { fetchPendingSolicitations } from './fetch-pending-solicitations-controller'
import { authenticate } from './authenticate-controller'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function routes(app: FastifyInstance) {
  app.post('/signup', signUpStudent)

  app.post(
    '/solicitations/:solicitationId/register',
    { onRequest: [verifyJWT] },
    registerStudent,
  )
  app.post('/drivers/register', registerDriver)
  app.post('/admins/register', registerAdmin)

  app.post('/sessions', authenticate)

  app.get('/solicitations', fetchPendingSolicitations)
}
