import { UsersRepository } from '@account/application/repositories/users-repository'
import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { StudentListsRepository } from '../repositories/student-lists-repository'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'

interface FetchStudentsOnListUseCaseRequest {
  userId: string
  routeListId: string
}

type FetchStudentsOnListUseCaseResponse = Either<
  UnregisteredUserError | ResourceNotFoundError,
  {
    studentsOnList: StudentProfile[]
  }
>

export class FetchStudentsOnListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
    private studentListsRepository: StudentListsRepository,
  ) {}

  async execute({
    userId,
    routeListId,
  }: FetchStudentsOnListUseCaseRequest): Promise<FetchStudentsOnListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new UnregisteredUserError())
    }

    const routeList = await this.routeListsRepository.findById(routeListId)

    if (!routeList) {
      return failure(new ResourceNotFoundError())
    }

    const studentsOnList =
      await this.studentListsRepository.findManyByRouteListIdWithProfile(
        routeListId,
      )

    return success({ studentsOnList })
  }
}
