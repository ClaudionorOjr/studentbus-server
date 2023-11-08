import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

interface UserProfileUseCaseRequest {
  userId: string
}

type UserProfileUseCaseResponse = Either<UnregisteredUserError, { user: User }>

export class UserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: UserProfileUseCaseRequest): Promise<UserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new UnregisteredUserError())
    }

    return success({ user })
  }
}
