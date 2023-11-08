import { beforeEach, describe, expect, it } from 'vitest'
import { CreateBondUseCase } from './create-bond'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryBondsRepository } from 'test/repositories/in-memory-bonds-repository'
import { makeUser } from 'test/factories/make-user'
import { makeInstitution } from 'test/factories/make-institution'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UnregisteredInstitutionError } from './errors/unregistered-institution-error'

let usersRepository: InMemoryUsersRepository
let institutionsRepository: InMemoryInstitutionsRepository
let bondsRepository: InMemoryBondsRepository
let sut: CreateBondUseCase

describe('Create bond use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    institutionsRepository = new InMemoryInstitutionsRepository()
    bondsRepository = new InMemoryBondsRepository()
    sut = new CreateBondUseCase(
      usersRepository,
      institutionsRepository,
      bondsRepository,
    )
  })

  it('should be able create a bond between the student and the institution', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))
    await institutionsRepository.create(makeInstitution({}, 'institution-01'))

    const result = await sut.execute({
      institutionId: 'institution-01',
      userId: 'user-01',
      course: 'math',
      turn: 'MORNING',
      period: '1',
      weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
    })

    expect(result.isSuccess()).toBe(true)
    expect(bondsRepository.bonds).toHaveLength(1)
  })

  it('should not be able to create a bond from a non-existent student', async () => {
    const result = await sut.execute({
      institutionId: 'institution-01',
      userId: 'user-01',
      course: 'math',
      turn: 'MORNING',
      period: '1',
      weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })

  it('should not be able to create a bond with an unregistered institution', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))

    const result = await sut.execute({
      institutionId: 'institution-01',
      userId: 'user-01',
      course: 'math',
      turn: 'MORNING',
      period: '1',
      weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredInstitutionError)
  })
})
