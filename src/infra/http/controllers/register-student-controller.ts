import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { RegisterStudentUseCase } from '@account/application/use-cases/register-student'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

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
    const registerStudentUseCase = container.resolve(RegisterStudentUseCase)

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
