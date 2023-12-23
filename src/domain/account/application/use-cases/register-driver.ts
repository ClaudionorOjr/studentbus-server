import { inject, injectable } from 'tsyringe'
import { User } from '@core/entities/user'
import { Driver } from '@account/enterprise/entities/driver'
import { Hasher } from '@account/cryptography/hasher'
import { UsersRepository } from '../repositories/users-repository'
import { Either, failure, success } from '@core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterDriverUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

type RegisterDriverUseCaseResponse = Either<UserAlreadyExistsError, object>

@injectable()
export class RegisterDriverUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('Hasher')
    private hashGenerator: Hasher,
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

    const driver = Driver.create({
      completeName,
      email,
      passwordHash,
      phone,
    })

    await this.usersRepository.create(driver as unknown as User)

    return success({})
  }
}
