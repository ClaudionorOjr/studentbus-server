import { PaginationParams } from '@core/repositories/pagination-params'
import { RouteListsRepository } from 'src/domain/transportation/application/repositories/route-lists-repository'
import { RouteList } from 'src/domain/transportation/enterprise/entities/route-list'

export class InMemoryRouteListsRepository implements RouteListsRepository {
  public routeLists: RouteList[] = []

  async create(routeList: RouteList): Promise<void> {
    this.routeLists.push(routeList)
  }

  async findById(id: string): Promise<RouteList | null> {
    const routeList = this.routeLists.find((routeList) => routeList.id === id)

    if (!routeList) {
      return null
    }

    return routeList
  }

  async list({ page }: PaginationParams): Promise<RouteList[]> {
    return this.routeLists.slice((page - 1) * 10, page * 10)
  }

  async save(routeList: RouteList): Promise<void> {
    const listIndex = this.routeLists.findIndex(
      (item) => item.id === routeList.id,
    )

    this.routeLists[listIndex] = routeList
  }
}
