import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteInstitutionUseCase } from './delete-institution'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeUser } from 'test/factories/make-user'
import { makeInstitution } from 'test/factories/make-institution'

let usersRepository: InMemoryUsersRepository
let institutionsRepository: InMemoryInstitutionsRepository
let sut: DeleteInstitutionUseCase

describe('Delete institution use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new DeleteInstitutionUseCase(usersRepository, institutionsRepository)
  })

  it('should be able to delete an institution', async () => {
    await usersRepository.create(makeUser({ rule: 'ADMIN' }, 'user-01'))
    await institutionsRepository.create(makeInstitution({}, 'institution-01'))

    expect(institutionsRepository.institutions).toHaveLength(1)

    await sut.execute({ userId: 'user-01', institutionId: 'institution-01' })

    expect(institutionsRepository.institutions).toHaveLength(0)
  })

  it('should not be able to delete a non-existent institution ', async () => {
    await usersRepository.create(makeUser({ rule: 'ADMIN' }, 'user-01'))

    await expect(() =>
      sut.execute({ userId: 'user-01', institutionId: 'institution-01' }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able a not admin user to delete an institution', async () => {
    await usersRepository.create(makeUser({ rule: 'STUDENT' }, 'user-01'))
    await institutionsRepository.create(makeInstitution({}, 'institution-01'))

    expect(institutionsRepository.institutions).toHaveLength(1)

    await expect(() =>
      sut.execute({ userId: 'user-01', institutionId: 'institution-01' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
