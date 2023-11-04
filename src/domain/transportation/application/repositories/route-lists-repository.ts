import { PaginationParams } from '@core/repositories/pagination-params'
import { RouteList } from '../../enterprise/entities/route-list'

export interface RouteListsRepository {
  create(routeList: RouteList): Promise<void>
  findById(id: string): Promise<RouteList | null>
  list(param: PaginationParams): Promise<RouteList[]>
  save(routeList: RouteList): Promise<void>
}
