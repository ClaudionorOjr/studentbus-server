import { beforeEach, describe, expect, it } from 'vitest'
import { FetchRouteListsHistory } from './fetch-route-lists-history'
import { InMemoryRouteListsRepository } from 'test/repositories/in-memory-route-lists-repository'
import { makeRouteList } from 'test/factories/make-route-list'

let routeListsRepository: InMemoryRouteListsRepository
let sut: FetchRouteListsHistory

describe('Fetch route lists history use case', () => {
  beforeEach(() => {
    routeListsRepository = new InMemoryRouteListsRepository()
    sut = new FetchRouteListsHistory(routeListsRepository)
  })

  it('should be able for the driver user to fetch the history of route lists', async () => {
    await routeListsRepository.create(makeRouteList())
    await routeListsRepository.create(makeRouteList())

    const { routeLists } = await sut.execute({ page: 1 })

    expect(routeLists).toHaveLength(2)
  })
})
