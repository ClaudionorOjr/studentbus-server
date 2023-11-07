import { PaginationParams } from '@core/repositories/pagination-params'
import { RouteListsRepository } from '@transportation/application/repositories/route-lists-repository'
import { RouteList } from '@transportation/enterprise/entities/route-list'
import { InMemoryStudentListsRepository } from './in-memory-student-lists-repository'

export class InMemoryRouteListsRepository implements RouteListsRepository {
  public routeLists: RouteList[] = []

  constructor(private studentListsRepository: InMemoryStudentListsRepository) {}

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

  async delete(routeListId: string): Promise<void> {
    const routeListIndex = this.routeLists.findIndex(
      (item) => item.id === routeListId,
    )

    this.routeLists.splice(routeListIndex, 1)

    await this.studentListsRepository.deleteManyByRouteListId(routeListId)
  }
}
