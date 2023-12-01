import { FastifyReply, FastifyRequest } from 'fastify'
import { makeStudentProfileUseCase } from '@infra/database/prisma/factories/make-student-profile-use-case'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

export async function studentProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  try {
    const studentProfileUseCase = makeStudentProfileUseCase()

    const result = await studentProfileUseCase.execute({ userId })

    if (result.isFailure()) {
      throw result.value
    }

    const { studentProfile } = result.value
    return reply.status(200).send({ studentProfile })
  } catch (error) {
    if (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(400).send({ message: error.message })
      }
    }

    throw error
  }
}
