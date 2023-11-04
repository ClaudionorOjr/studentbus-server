import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterAdminUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

export class RegisterAdminUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    completeName,
    email,
    password,
    phone,
  }: RegisterAdminUseCaseRequest): Promise<void> {
    const userAlredyExists = await this.usersRepository.findByEmail(email)

    if (userAlredyExists) {
      throw new Error('User already exists!')
    }

    const passwordHash = await hash(password, 8)

    const admin = User.create({
      completeName,
      email,
      passwordHash,
      phone,
      rule: 'ADMIN',
    })

    await this.usersRepository.create(admin)
  }
}
