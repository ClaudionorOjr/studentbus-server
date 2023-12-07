import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { inject, injectable } from 'tsyringe'

interface UserProfileUseCaseRequest {
  userId: string
}

type UserProfileUseCaseResponse = Either<UnregisteredUserError, { user: User }>

@injectable()
export class UserProfileUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

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
