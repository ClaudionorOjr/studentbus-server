import { makeFetchPendingSolicitationsUseCase } from '@infra/database/prisma/factories/make-fetch-pending-solicitations-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchPendingSolicitations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPendingSolicitationsUseCase =
    makeFetchPendingSolicitationsUseCase()

  const result = await fetchPendingSolicitationsUseCase.execute()

  if (result.isFailure()) {
    return reply.status(400).send()
  }
  const { solicitations } = result.value

  return reply.status(200).send(solicitations)
}
