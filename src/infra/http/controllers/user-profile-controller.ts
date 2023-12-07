import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { UserProfileUseCase } from '@account/application/use-cases/user-profile'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

export async function userProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const userProfileUseCase = container.resolve(UserProfileUseCase)

    const result = await userProfileUseCase.execute({ userId })

    if (result.isFailure()) {
      throw result.value
    }

    const { user } = result.value
    return reply.status(200).send({ user })
  } catch (error) {
    if (error instanceof UnregisteredUserError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
