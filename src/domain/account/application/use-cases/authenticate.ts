import { HashComparer } from '@account/cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { Encrypter } from '@account/cryptography/encrypter'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
}

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
      throw new Error('Invalid credentials.')
    }

    const doesPasswordMatches = await this.hashComparer.compare(
      password,
      user.passwordHash,
    )

    if (!doesPasswordMatches) {
      throw new Error('Invalid credentials.')
    }

    const accessToken = await this.encrypter.encrypt({ sub: user.id })

    return { accessToken }
  }
}
