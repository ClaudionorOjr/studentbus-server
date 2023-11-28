import { HashComparer } from '@account/cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { Encrypter } from '@account/cryptography/encrypter'
import { Either, failure, success } from '@core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return failure(new WrongCredentialsError())
    }

    const doesPasswordMatches = await this.hashComparer.compare(
      password,
      user.passwordHash,
    )

    if (!doesPasswordMatches) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      role: user.role,
    })

    return success({ accessToken })
  }
}
