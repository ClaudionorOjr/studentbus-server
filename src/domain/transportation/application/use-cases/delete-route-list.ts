import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UnregisteredInstitutionError } from '@institutional/application/use-cases/errors/unregistered-institution-error'

interface DeleteRouteListUseCaseRequest {
  userId: string
  routeListId: string
}

type DeleteRouteListUseCaseResponse = Either<
  UnregisteredUserError | UnregisteredInstitutionError,
  object
>
export class DeleteRouteListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({
    userId,
    routeListId,
  }: DeleteRouteListUseCaseRequest): Promise<DeleteRouteListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      // throw new Error('User does not exist.')
      return failure(new UnregisteredUserError())
    }

    const routeList = await this.routeListsRepository.findById(routeListId)

    if (!routeList) {
      // throw new Error('Resource not found.')
      return failure(new UnregisteredInstitutionError())
    }

    await this.routeListsRepository.delete(routeListId)

    return success({})
  }
}
