import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UsersRepository } from '../repositories/users-repository'
import { StudentsRepository } from '../repositories/students-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseReponse = Either<UnregisteredUserError, object>

export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseReponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new UnregisteredUserError())
    }

    if (user.rule === 'STUDENT') {
      await this.studentsRepository.delete(user.id)
    }

    await this.usersRepository.delete(user.id)

    return success({})
  }
}
