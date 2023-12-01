import { FastifyReply, FastifyRequest } from 'fastify'
import { makeDeleteYourAccountUseCase } from '@infra/database/prisma/factories/make-delete-your-account-use-case'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

export async function deleteYourAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const deleteYourAccountUseCase = makeDeleteYourAccountUseCase()

    const result = await deleteYourAccountUseCase.execute({ userId })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof UnregisteredUserError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
