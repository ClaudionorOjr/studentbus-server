import { FastifyInstance } from 'fastify'
import { signUpStudent } from './signup-student-controller'

export async function routes(app: FastifyInstance) {
  app.post('/signup', signUpStudent)
}
