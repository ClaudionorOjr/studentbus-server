import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterDriverUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

export class RegisterDriverUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    completeName,
    email,
    password,
    phone,
  }: RegisterDriverUseCaseRequest): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists!')
    }

    const passwordHash = await hash(password, 8)

    const driver = User.create({
      completeName,
      email,
      passwordHash,
      phone,
      rule: 'DRIVER',
    })

    await this.usersRepository.create(driver)
  }
}
