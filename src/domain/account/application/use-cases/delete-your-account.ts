import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UsersRepository } from '../repositories/users-repository'
import { StudentsRepository } from '../repositories/students-repository'

interface DeleteYourAccountUseCaseRequest {
  userId: string
}

type DeleteYourAccountUseCaseReponse = Either<UnregisteredUserError, object>

export class DeleteYourAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute({
    userId,
  }: DeleteYourAccountUseCaseRequest): Promise<DeleteYourAccountUseCaseReponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new UnregisteredUserError())
    }

    if (user.role === 'STUDENT') {
      await this.studentsRepository.delete(user.id)
    }

    await this.usersRepository.delete(user.id)

    return success({})
  }
}
