import { RouteList } from '../../enterprise/entities/route-list'
import { RouteListsRepository } from '../repositories/route-lists-repository'

interface FetchRouteListsHistoryRequest {
  page: number
}

interface FetchRouteListsHistoryResponse {
  routeLists: RouteList[]
}

export class FetchRouteListsHistory {
  constructor(private routeListsRepository: RouteListsRepository) {}

  async execute({
    page,
  }: FetchRouteListsHistoryRequest): Promise<FetchRouteListsHistoryResponse> {
    const routeLists = await this.routeListsRepository.list({ page })

    return { routeLists }
  }
}
