import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '@account/cryptography/hash-generator'

interface RegisterDriverUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

export class RegisterDriverUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

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

    const passwordHash = await this.hashGenerator.hash(password)

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
