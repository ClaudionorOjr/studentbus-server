import { FastifyReply, FastifyRequest } from 'fastify'
import { WrongCredentialsError } from '@account/application/use-cases/errors/wrong-credentials-error'
import { makeAuthenticateUseCase } from '@infra/database/prisma/factories/make-authenticate-use-case'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.coerce.string().min(6),
  })

  try {
    const { email, password } = authenticateBodySchema.parse(request.body)

    const authenticateUseCase = makeAuthenticateUseCase()

    const result = await authenticateUseCase.execute({
      email,
      password,
    })

    if (result.isFailure()) {
      throw result.value
    }

    const { accessToken } = result.value
    return reply.status(200).send({ accessToken })
  } catch (error) {
    if (error instanceof WrongCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
