import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeRegisterStudentUseCase } from '@infra/database/prisma/factories/make-register-student-use-case'
import { z } from 'zod'

export async function registerStudent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerStudentParamsSchema = z.object({
    solicitationId: z.string(),
  })

  const { solicitationId } = registerStudentParamsSchema.parse(request.params)

  try {
    const registerStudentUseCase = makeRegisterStudentUseCase()

    const result = await registerStudentUseCase.execute({ solicitationId })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}
