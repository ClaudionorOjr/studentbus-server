import 'reflect-metadata'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { env } from '@infra/env'
import { routes } from './infra/http/controllers/routes'
import { ZodError } from 'zod'
import '@infra/container'

export const app = fastify()

const privateKey = env.JWT_PRIVATE_KEY
const publicKey = env.JWT_PUBLIC_KEY

// TODO: terminar as configurações do JWT, como cookies, expiração...
app.register(fastifyJwt, {
  secret: {
    private: Buffer.from(privateKey, 'base64'),
    public: Buffer.from(publicKey, 'base64'),
  },
  sign: {
    algorithm: 'RS256',
  },
})

app.register(fastifyCookie)

/* ROUTES */
app.register(routes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  // * Para que o Error Handler possa retornar os erros vindo do middleware verifyJWT
  if ('statusCode' in error) {
    return reply.send(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
