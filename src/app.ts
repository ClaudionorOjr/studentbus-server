import fastify from 'fastify'
import { routes } from './infra/http/controllers/routes'
import { ZodError } from 'zod'

export const app = fastify()

/* ROUTES */
app.register(routes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
