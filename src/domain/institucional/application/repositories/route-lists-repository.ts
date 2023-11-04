import { RouteList } from '../../enterprise/entities/route-list'

export interface RouteListsRepository {
  create(routeList: RouteList): Promise<void>
}
