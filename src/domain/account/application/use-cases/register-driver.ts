import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '@account/cryptography/hash-generator'
import { Either, failure, success } from '@core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterDriverUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

type RegisterDriverUseCaseResponse = Either<UserAlreadyExistsError, object>

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
  }: RegisterDriverUseCaseRequest): Promise<RegisterDriverUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      return failure(new UserAlreadyExistsError())
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

    return success({})
  }
}
