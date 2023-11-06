import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'

interface DeleteRouteListUseCaseRequest {
  userId: string
  routeListId: string
}

export class DeleteRouteListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({
    userId,
    routeListId,
  }: DeleteRouteListUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User does not exist.')
    }

    const routeList = await this.routeListsRepository.findById(routeListId)

    if (!routeList) {
      throw new Error('Resource not found.')
    }

    await this.routeListsRepository.delete(routeListId)
  }
}
