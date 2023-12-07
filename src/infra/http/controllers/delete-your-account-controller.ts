import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { DeleteYourAccountUseCase } from '@account/application/use-cases/delete-your-account'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

export async function deleteYourAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const deleteYourAccountUseCase = container.resolve(DeleteYourAccountUseCase)

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
