import { FetchPendingSolicitationsUseCase } from '@account/application/use-cases/fetch-pending-solicitations'
import { PrismaSolicitatitonsRepository } from '../repositories/prisma-solicitations-repository'

export function makeFetchPendingSolicitationsUseCase() {
  const solicitationsRepository = new PrismaSolicitatitonsRepository()
  const fetchPendingSolicitationsUseCase = new FetchPendingSolicitationsUseCase(
    solicitationsRepository,
  )

  return fetchPendingSolicitationsUseCase
}
