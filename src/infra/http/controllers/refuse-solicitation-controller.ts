import { FastifyReply, FastifyRequest } from 'fastify'
import { RefuseSolicitationUseCase } from '@account/application/use-cases/refuse-solicitation'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function refuseSolicitation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refuseSolicitationParamsSchema = z.object({
    solicitationId: z.string().uuid(),
  })

  const refuseSolicitationBodySchema = z.object({
    refuseReason: z.string(),
  })

  const { solicitationId } = refuseSolicitationParamsSchema.parse(
    request.params,
  )
  const { refuseReason } = refuseSolicitationBodySchema.parse(request.body)

  try {
    const refuseSolicitationUseCase = container.resolve(
      RefuseSolicitationUseCase,
    )

    const result = await refuseSolicitationUseCase.execute({
      solicitationId,
      refuseReason,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
