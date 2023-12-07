import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '../repositories/users-repository'
import { Hasher } from '@account/cryptography/hasher'
import { Either, failure, success } from '@core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

interface ChangePasswordUseCaseRequest {
  userId: string
  password: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = Either<
  UnregisteredUserError | WrongCredentialsError,
  object
>

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('Hasher')
    private hasher: Hasher,
  ) {}

  async execute({
    userId,
    password,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new UnregisteredUserError())
    }

    const doesPasswordMatches = await this.hasher.compare(
      password,
      user.passwordHash,
    )

    if (!doesPasswordMatches) {
      return failure(new WrongCredentialsError())
    }

    const newPasswordHash = await this.hasher.hash(newPassword)

    user.passwordHash = newPasswordHash

    await this.usersRepository.save(user)

    return success({})
  }
}
