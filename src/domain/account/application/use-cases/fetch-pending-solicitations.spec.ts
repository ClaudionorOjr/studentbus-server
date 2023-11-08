import { beforeEach, describe, expect, it } from 'vitest'
import { FetchPendingSolicitationsUseCase } from './fetch-pending-solicitations'
import { InMemorySolicitationsRepository } from 'test/repositories/in-memory-solicitations-repository'
import { makeSolicitation } from 'test/factories/make-solicitation'

let solicitationsRepository: InMemorySolicitationsRepository
let sut: FetchPendingSolicitationsUseCase

describe('Fetch solicitations use case', () => {
  beforeEach(() => {
    solicitationsRepository = new InMemorySolicitationsRepository()
    sut = new FetchPendingSolicitationsUseCase(solicitationsRepository)
  })

  it('should be able to fetch all solicitations', async () => {
    await solicitationsRepository.create(await makeSolicitation())
    await solicitationsRepository.create(await makeSolicitation())
    await solicitationsRepository.create(
      await makeSolicitation({ status: 'REFUSED' }),
    )

    const result = await sut.execute()

    expect(result.isSuccess()).toBe(true)
    expect(result.value?.solicitations).toHaveLength(2)
    expect(solicitationsRepository.solicitations).toHaveLength(3)
  })
})
