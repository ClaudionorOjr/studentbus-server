import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { FetchPendingSolicitationsUseCase } from '@account/application/use-cases/fetch-pending-solicitations'

export async function fetchPendingSolicitations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPendingSolicitationsUseCase = container.resolve(
    FetchPendingSolicitationsUseCase,
  )

  const result = await fetchPendingSolicitationsUseCase.execute()

  if (result.isFailure()) {
    return reply.status(400).send({ message: 'Bad request.' })
  }
  const { solicitations } = result.value

  return reply.status(200).send(solicitations)
}
