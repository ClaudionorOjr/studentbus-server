import { beforeEach, describe, expect, it } from 'vitest'
import { EditInstitutionUseCase } from './edit-institution'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeInstitution } from 'test/factories/make-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let sut: EditInstitutionUseCase

describe('Edit institution use case', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new EditInstitutionUseCase(institutionsRepository)
  })

  it('should be able to edit an institution', async () => {
    await institutionsRepository.create(makeInstitution({}, 'institution-01'))

    await sut.execute({ institutionId: 'institution-01', name: 'UERN' })

    expect(institutionsRepository.institutions[0]).toEqual(
      expect.objectContaining({ name: 'UERN' }),
    )
  })
})
