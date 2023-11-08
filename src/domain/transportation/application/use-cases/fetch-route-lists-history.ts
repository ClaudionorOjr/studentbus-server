import { Either, success } from '@core/either'
import { RouteList } from '../../enterprise/entities/route-list'
import { RouteListsRepository } from '../repositories/route-lists-repository'

interface FetchRouteListsHistoryRequest {
  page: number
}

type FetchRouteListsHistoryResponse = Either<
  null,
  {
    routeLists: RouteList[]
  }
>

export class FetchRouteListsHistory {
  constructor(private routeListsRepository: RouteListsRepository) {}

  async execute({
    page,
  }: FetchRouteListsHistoryRequest): Promise<FetchRouteListsHistoryResponse> {
    const routeLists = await this.routeListsRepository.list({ page })

    return success({ routeLists })
  }
}
