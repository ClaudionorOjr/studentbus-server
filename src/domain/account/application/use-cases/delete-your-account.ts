import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '../repositories/users-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

interface DeleteYourAccountUseCaseRequest {
  userId: string
}

type DeleteYourAccountUseCaseReponse = Either<UnregisteredUserError, object>

@injectable()
export class DeleteYourAccountUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('StudentsRepository')
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
    } else {
      await this.usersRepository.delete(user.id)
    }

    return success({})
  }
}
