import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '@account/cryptography/hash-generator'
import { Either, failure, success } from '@core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterAdminUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

type RegisterAdminUseCaseResponse = Either<UserAlreadyExistsError, object>

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
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const userAlredyExists = await this.usersRepository.findByEmail(email)

    if (userAlredyExists) {
      return failure(new UserAlreadyExistsError())
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const admin = User.create({
      completeName,
      email,
      passwordHash,
      phone,
      role: 'ADMIN',
    })

    await this.usersRepository.create(admin)

    return success({})
  }
}
