import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists-error'
import { makeRegisterDriverUseCase } from '@infra/database/prisma/factories/make-register-driver-use-case'
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
    const registerDriverUseCase = makeRegisterDriverUseCase()

    await registerDriverUseCase.execute({
      completeName,
      email,
      password,
      phone,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
