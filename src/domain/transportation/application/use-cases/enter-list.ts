import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'
import { StudentOnList } from '../../enterprise/entities/student-on-list'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { NotAllowedError } from '@core/errors/not-allowerd-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { UserAlreadyOnListError } from './errors/user-already-on-list-error'

interface EnterListUseCaseRequest {
  userId: string
  listId: string
}

type EnterListUseCaseResponse = Either<
  | UnregisteredUserError
  | NotAllowedError
  | ResourceNotFoundError
  | UserAlreadyOnListError,
  object
>

export class EnterListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
    private studentListsRepository: StudentListsRepository,
  ) {}

  async execute({
    userId,
    listId,
  }: EnterListUseCaseRequest): Promise<EnterListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    const routeList = await this.routeListsRepository.findById(listId)

    if (!user) {
      // throw new Error('User not found.')
      return failure(new UnregisteredUserError())
    }

    if (user.rule !== 'STUDENT') {
      // throw new Error('Not allowed')
      return failure(new NotAllowedError())
    }

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

    if (student) {
      // throw new Error('User is already on the list')
      return failure(new UserAlreadyOnListError(user.completeName))
    }

    const studentOnList = StudentOnList.create({
      userId,
      listId,
    })

    await this.studentListsRepository.create(studentOnList)

    return success({})
  }
}
