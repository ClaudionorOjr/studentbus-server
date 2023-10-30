import { RouteListsRepository } from 'src/domain/transportation/application/repositories/route-lists-repository'
import { RouteList } from 'src/domain/transportation/enterprise/entities/route-list'

export class InMemoryRouteListsRepository implements RouteListsRepository {
  public routeLists: RouteList[] = []

  async create(routeList: RouteList): Promise<void> {
    this.routeLists.push(routeList)
  }
}
