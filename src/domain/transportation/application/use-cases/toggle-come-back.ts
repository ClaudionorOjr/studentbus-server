import { UsersRepository } from '@account/application/repositories/users-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { NotAllowedError } from '@core/errors/not-allowerd-error'

interface ToggleComeBackUseCaseRequest {
  userId: string
  studentListId: string
}

type ToggleComeBackUseCaseResponse = Either<
  UnregisteredUserError | ResourceNotFoundError | NotAllowedError,
  object
>

export class ToggleComeBackUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
    private studentListsRepository: StudentListsRepository,
  ) {}

  async execute({
    userId,
    studentListId,
  }: ToggleComeBackUseCaseRequest): Promise<ToggleComeBackUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      // throw new Error('User does not exist.')
      return failure(new UnregisteredUserError())
    }

    const studentList =
      await this.studentListsRepository.findById(studentListId)

    if (!studentList) {
      // throw new Error('Resource not found.')
      return failure(new ResourceNotFoundError())
    }

    if (studentList.userId !== userId) {
      // throw new Error('Not allowed.')
      return failure(new NotAllowedError())
    }

    const routeList = await this.routeListsRepository.findById(
      studentList.listId,
    )

    if (!routeList) {
      // throw new Error('Resource not found.')
      return failure(new ResourceNotFoundError())
    }

    if (!routeList.open) {
      // throw new Error('Not allowed.')
      return failure(new NotAllowedError())
    }

    studentList.toggleComeBack()

    await this.studentListsRepository.save(studentList)

    return success({})
  }
}
