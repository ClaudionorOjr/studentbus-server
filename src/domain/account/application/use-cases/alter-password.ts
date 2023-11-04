import { UsersRepository } from '../repositories/users-repository'
import { HashComparer } from '@account/cryptography/hash-comparer'
import { HashGenerator } from '@account/cryptography/hash-generator'

interface AlterPasswordUseCaseRequest {
  userId: string
  password: string
  newPassword: string
}

export class AlterPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: HashComparer & HashGenerator,
  ) {}

  async execute({
    userId,
    password,
    newPassword,
  }: AlterPasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User does not exists.')
    }

    const doesPasswordMatches = await this.hasher.compare(
      password,
      user.passwordHash,
    )

    if (!doesPasswordMatches) {
      throw new Error('Invalid credentials')
    }

    const newPasswordHash = await this.hasher.hash(newPassword)

    user.passwordHash = newPasswordHash

    await this.usersRepository.save(user)
  }
}
