import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists-error'
import { makeRegisterAdminUseCase } from '@infra/database/prisma/factories/make-register-admin-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerAdminBodySchema = z.object({
    completeName: z.string(),
    email: z.string().email(),
    password: z.coerce.string().min(6),
    phone: z.string(),
  })

  const { completeName, email, password, phone } =
    registerAdminBodySchema.parse(request.body)

  try {
    const registerAdminUseCase = makeRegisterAdminUseCase()

    const result = await registerAdminUseCase.execute({
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
