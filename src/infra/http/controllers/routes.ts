import { FastifyInstance } from 'fastify'
import { signUpStudent } from './signup-student-controller'
import { registerStudent } from './register-student-controller'

export async function routes(app: FastifyInstance) {
  app.post('/signup', signUpStudent)

  app.post('/solicitations/:solicitationId/register', registerStudent)
}
