import { Either, failure, success } from '@core/either'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { UserNotOnListError } from './errors/user-not-on-list-error'

interface ExitListUseCaseRequest {
  userId: string
  listId: string
}

type ExitListUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | UserNotOnListError,
  object
>

export class ExitListUseCase {
  constructor(
    private studentListsRepository: StudentListsRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({
    userId,
    listId,
  }: ExitListUseCaseRequest): Promise<ExitListUseCaseResponse> {
    const routeList = await this.routeListsRepository.findById(listId)

    if (!routeList) {
      // throw new Error('Resource not found.')
      return failure(new ResourceNotFoundError())
    }

    if (!routeList.open) {
      // throw new Error('Not allowed')
      return failure(new NotAllowedError())
    }

    const student = (
      await this.studentListsRepository.findManyByRouteListId(listId)
    ).find((studentList) => studentList.userId === userId)

    if (!student) {
      // throw new Error('User is not on the list.')
      return failure(new UserNotOnListError())
    }

    await this.studentListsRepository.delete(userId, listId)

    return success({})
  }
}
