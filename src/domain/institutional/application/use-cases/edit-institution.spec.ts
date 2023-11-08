import { beforeEach, describe, expect, it } from 'vitest'
import { EditInstitutionUseCase } from './edit-institution'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-institution'
import { UnregisteredInstitutionError } from './errors/unregistered-institution-error'

let institutionsRepository: InMemoryInstitutionsRepository
let sut: EditInstitutionUseCase

describe('Edit institution use case', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new EditInstitutionUseCase(institutionsRepository)
  })

  it('should be able to edit an institution', async () => {
    await institutionsRepository.create(makeInstitution({}, 'institution-01'))

    const result = await sut.execute({
      institutionId: 'institution-01',
      name: 'UERN',
    })

    expect(result.isSuccess()).toBe(true)
    expect(institutionsRepository.institutions[0]).toEqual(
      expect.objectContaining({ name: 'UERN' }),
    )
  })

  it('should not be able to edit a non-existent institution', async () => {
    const result = await sut.execute({
      institutionId: 'institution-01',
      name: 'UERN',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredInstitutionError)
  })
})
