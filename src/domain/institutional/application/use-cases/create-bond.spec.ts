import { beforeEach, describe, expect, it } from 'vitest'
import { CreateBondUseCase } from './create-bond'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { InMemoryBondsRepository } from 'test/repositories/in-memory-bonds-repository'
import { makeUser } from 'test/factories/make-user'
import { makeInstitution } from 'test/factories/make-institution'

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

    await sut.execute({
      institutionId: 'institution-01',
      userId: 'user-01',
      course: 'math',
      turn: 'MORNING',
      period: '1',
      weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
    })

    expect(bondsRepository.bonds).toHaveLength(1)
  })

  it('should not be able to create a bond from a non-existent student', async () => {
    await expect(() =>
      sut.execute({
        institutionId: 'institution-01',
        userId: 'user-01',
        course: 'math',
        turn: 'MORNING',
        period: '1',
        weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to create a bond with an unregistered institution', async () => {
    await usersRepository.create(makeUser({}, 'user-01'))

    await expect(() =>
      sut.execute({
        institutionId: 'institution-01',
        userId: 'user-01',
        course: 'math',
        turn: 'MORNING',
        period: '1',
        weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY'],
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
