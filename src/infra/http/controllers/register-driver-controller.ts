import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { RegisterDriverUseCase } from '@account/application/use-cases/register-driver'
import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists-error'

import { z } from 'zod'

export async function registerDriver(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerDriverBodySchema = z.object({
    completeName: z.string(),
    email: z.string().email(),
    password: z.coerce.string().min(6),
    phone: z.string(),
  })

  const { completeName, email, password, phone } =
    registerDriverBodySchema.parse(request.body)

  try {
    const registerDriverUseCase = container.resolve(RegisterDriverUseCase)

    const result = await registerDriverUseCase.execute({
      completeName,
      email,
      password,
      phone,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
