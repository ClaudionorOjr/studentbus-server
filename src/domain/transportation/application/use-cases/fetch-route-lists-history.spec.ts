import { beforeEach, describe, expect, it } from 'vitest'
import { FetchRouteListsHistory } from './fetch-route-lists-history'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeRouteList } from 'test/factories/make-route-list'
import { InMemoryStudentListsRepository } from 'test/repositories/in-memory-student-lists-repository'

let routeListsRepository: InMemoryRouteListsRepository
let studentListsRepository: InMemoryStudentListsRepository
let sut: FetchRouteListsHistory

describe('Fetch route lists history use case', () => {
  beforeEach(() => {
    studentListsRepository = new InMemoryStudentListsRepository()
    routeListsRepository = new InMemoryRouteListsRepository(
      studentListsRepository,
    )
    sut = new FetchRouteListsHistory(routeListsRepository)
  })

  it('should be able for the driver user to fetch the history of route lists', async () => {
    await routeListsRepository.create(makeRouteList())
    await routeListsRepository.create(makeRouteList())

    const result = await sut.execute({ page: 1 })

    expect(result.isSuccess()).toBe(true)
    expect(result.value?.routeLists).toHaveLength(2)
  })
})
