import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'

interface CloseRouteListRequest {
  userId: string
  routeListId: string
}

export class CloseRouteList {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({ userId, routeListId }: CloseRouteListRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User does not exist.')
    }

    if (user.rule !== 'DRIVER') {
      throw new Error('Not allowed.')
    }

    const routeList = await this.routeListsRepository.findById(routeListId)

    if (!routeList) {
      throw new Error('Resource not found.')
    }

    if (routeList.userId !== userId) {
      throw new Error('Not allowed')
    }

    routeList.closeList()

    await this.routeListsRepository.save(routeList)
  }
}
