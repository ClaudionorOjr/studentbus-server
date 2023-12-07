import { CreateRouteListUseCase } from './create-route-list'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { InMemoryInstitutionsRepository } from 'test/repositories/in-memory-institutions-repository'
import { makeUser } from 'test/factories/make-user'
import { makeInstitution } from 'test/factories/make-institution'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { UnregisteredInstitutionError } from '@institutional/application/use-cases/errors/unregistered-institution-error'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryResponsiblesRepository } from 'test/repositories/in-memory-responsibles-repository'

let usersRepository: InMemoryUsersRepository
let studentsRepository: InMemoryStudentsRepository
let responsiblesRepository: InMemoryResponsiblesRepository
let institutiosRepository: InMemoryInstitutionsRepository
let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: CreateRouteListUseCase

describe('Create route list use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    responsiblesRepository = new InMemoryResponsiblesRepository()
    studentsRepository = new InMemoryStudentsRepository(
      usersRepository,
      responsiblesRepository,
    )
    institutiosRepository = new InMemoryInstitutionsRepository()
    studentListsRepository = new InMemoryStudentListsRepository(
      usersRepository,
      studentsRepository,
      responsiblesRepository,
    )

    routeListsRepository = new InMemoryRouteListsRepository(
      studentListsRepository,
    )
    sut = new CreateRouteListUseCase(
      usersRepository,
      institutiosRepository,
      routeListsRepository,
    )
  })

  it('should be able to create a route list', async () => {
    await usersRepository.create(makeUser({ role: 'DRIVER' }, 'user-01'))
    await institutiosRepository.create(
      makeInstitution({ name: 'UERN' }, 'institution-01'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UFERSA' }, 'institution-02'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UNINASSAU' }, 'institution-03'),
    )

    const result = await sut.execute({
      userId: 'user-01',
      departureTime: '17:30',
      returnTime: '22:00',
      turn: 'MORNING',
      capacity: 45,
      institutions: ['UERN', 'UFERSA'],
    })

    expect(result.isSuccess()).toBe(true)

    // expect.arrayContaining([expect.any(String)]) ou expect.any(Array<string>)
    expect(routeListsRepository.routeLists).toHaveLength(1)
    expect(routeListsRepository.routeLists).toEqual([
      expect.objectContaining({
        institutions: ['UERN', 'UFERSA'],
      }),
    ])
  })

  it('should not be able a non-existent user to create a route list', async () => {
    const result = await sut.execute({
      userId: 'user-01',
      departureTime: '17:30',
      returnTime: '22:00',
      turn: 'MORNING',
      capacity: 45,
      institutions: ['UERN', 'UFERSA'],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredUserError)
  })

  it('should not be able a non-driver user to create a route list', async () => {
    await usersRepository.create(makeUser({ role: 'STUDENT' }, 'user-01'))

    await institutiosRepository.create(
      makeInstitution({ name: 'UERN' }, 'institution-01'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UFERSA' }, 'institution-02'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UNINASSAU' }, 'institution-03'),
    )

    const result = await sut.execute({
      userId: 'user-01',
      departureTime: '17:30',
      returnTime: '22:00',
      turn: 'MORNING',
      capacity: 45,
      institutions: ['UERN', 'UFERSA'],
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to create a route list with an unregistered institution', async () => {
    await usersRepository.create(makeUser({ role: 'DRIVER' }, 'user-01'))
    await institutiosRepository.create(
      makeInstitution({ name: 'UERN' }, 'institution-01'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UFERSA' }, 'institution-02'),
    )
    await institutiosRepository.create(
      makeInstitution({ name: 'UNINASSAU' }, 'institution-03'),
    )

    const result = await sut.execute({
      userId: 'user-01',
      departureTime: '17:30',
      returnTime: '22:00',
      turn: 'MORNING',
      capacity: 45,
      institutions: ['IFRN', 'UERN', 'UFERSA'],
    })
    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UnregisteredInstitutionError)
  })
})
