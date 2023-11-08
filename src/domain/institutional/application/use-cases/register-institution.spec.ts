import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterInstitutionUseCase } from './register-institution'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { Institution } from '../../enterprise/entities/institution'
import { InstitutionAlreadyExistsError } from './errors/institution-already-exists-error'

let institutionsRepository: InMemoryInstitutionsRepository
let sut: RegisterInstitutionUseCase

describe('Register institution use case', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new RegisterInstitutionUseCase(institutionsRepository)
  })

  it('should be able to register an institution', async () => {
    const result = await sut.execute({
      name: 'College',
    })

    expect(result.isSuccess()).toBe(true)
    expect(institutionsRepository.institutions).toHaveLength(1)
    expect(institutionsRepository.institutions[0].name).toEqual('College')
  })

  it('should not be able to register an institution with same name', async () => {
    await institutionsRepository.create(Institution.create({ name: 'College' }))

    const result = await sut.execute({
      name: 'College',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(InstitutionAlreadyExistsError)
  })
})
