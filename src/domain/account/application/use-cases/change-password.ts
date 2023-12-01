import { UsersRepository } from '../repositories/users-repository'
import { HashComparer } from '@account/cryptography/hash-comparer'
import { HashGenerator } from '@account/cryptography/hash-generator'
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

export class ChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: HashComparer & HashGenerator,
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
