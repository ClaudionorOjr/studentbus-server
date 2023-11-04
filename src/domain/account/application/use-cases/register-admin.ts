import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '@account/cryptography/hash-generator'

interface RegisterAdminUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

export class RegisterAdminUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

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

    const passwordHash = await this.hashGenerator.hash(password)

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
