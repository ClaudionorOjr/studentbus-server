import 'reflect-metadata'
import { InMemorySolicitationsRepository } from 'test/repositories/in-memory-solicitations-repository'
import { RefuseSolicitationUseCase } from './refuse-solicitation'
import { makeSolicitation } from 'test/factories/make-solicitation'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Refuse solicitation use case', () => {
  let solicitationsRepository: InMemorySolicitationsRepository
  let sut: RefuseSolicitationUseCase

  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository()
    sut = new RefuseSolicitationUseCase(solicitationsRepository)
  })

  it('should be able to refuse a solicitation', async () => {
    const solicitation = makeSolicitation({}, 'solicitation-01')
    await solicitationsRepository.create(solicitation)

    const result = await sut.execute({
      solicitationId: 'solicitation-01',
      refuseReason: 'solicitation reason',
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(solicitationsRepository.solicitations[0].status).toBe('REFUSED')
  })

  it('should not be able to refuse a non-existent solicitation', async () => {
    const result = await sut.execute({
      solicitationId: 'solicitation-01',
      refuseReason: 'solicitation reason',
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
