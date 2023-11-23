import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeRegisterStudentUseCase } from 'src/infra/database/prisma/factories/make-register-student-use-case'
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

    await registerStudentUseCase.execute({ solicitationId })

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
