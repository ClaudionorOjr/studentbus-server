import { compare, hash } from 'bcryptjs'
import { UsersRepository } from '../repositories/users-repository'

interface AlterPasswordUseCaseRequest {
  userId: string
  password: string
  newPassword: string
}

export class AlterPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    password,
    newPassword,
  }: AlterPasswordUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User does not exists.')
    }

    const doesPasswordMatches = await compare(password, user.passwordHash)

    if (!doesPasswordMatches) {
      throw new Error('Invalid credentials')
    }

    const newPasswordHash = await hash(newPassword, 8)

    user.passwordHash = newPasswordHash

    await this.usersRepository.save(user)
  }
}
