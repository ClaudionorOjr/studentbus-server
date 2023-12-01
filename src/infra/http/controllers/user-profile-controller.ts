import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { makeUserProfileUseCase } from '@infra/database/prisma/factories/make-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function userProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const userProfileUseCase = makeUserProfileUseCase()

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
