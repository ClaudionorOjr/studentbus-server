import { WrongCredentialsError } from '@account/application/use-cases/errors/wrong-credentials-error'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { makeChangePasswordUseCase } from '@infra/database/prisma/factories/make-change-password-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changePasswordBodySchema = z.object({
    password: z.string().min(6),
    newPassword: z.string().min(6),
  })

  const { password, newPassword } = changePasswordBodySchema.parse(request.body)

  const userId = request.user.sub
  try {
    const changePasswordUseCase = makeChangePasswordUseCase()

    const result = await changePasswordUseCase.execute({
      userId,
      password,
      newPassword,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(200).send()
  } catch (error) {
    if (error instanceof UnregisteredUserError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof WrongCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
