import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

interface CloseRouteListRequest {
  userId: string
  routeListId: string
}

type CloseRouteListResponse = Either<
  UnregisteredUserError | NotAllowedError | ResourceNotFoundError,
  object
>

export class CloseRouteList {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({
    userId,
    routeListId,
  }: CloseRouteListRequest): Promise<CloseRouteListResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      // throw new Error('User does not exist.')
      return failure(new UnregisteredUserError())
    }

    if (user.role !== 'DRIVER') {
      // throw new Error('Not allowed.')
      return failure(new NotAllowedError())
    }

    const routeList = await this.routeListsRepository.findById(routeListId)

    if (!routeList) {
      // throw new Error('Resource not found.')
      return failure(new ResourceNotFoundError())
    }

    if (routeList.userId !== userId) {
      // throw new Error('Not allowed')
      return failure(new NotAllowedError())
    }

    routeList.closeList()

    await this.routeListsRepository.save(routeList)

    return success({})
  }
}
