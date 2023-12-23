import { inject, injectable } from 'tsyringe'
import { User } from '@core/entities/user'
import { Admin } from '@account/enterprise/entities/admin'
import { UsersRepository } from '../repositories/users-repository'
import { Hasher } from '@account/cryptography/hasher'
import { Either, failure, success } from '@core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterAdminUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

type RegisterAdminUseCaseResponse = Either<UserAlreadyExistsError, object>

@injectable()
export class RegisterAdminUseCase {
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
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const userAlredyExists = await this.usersRepository.findByEmail(email)

    if (userAlredyExists) {
      return failure(new UserAlreadyExistsError())
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      completeName,
      email,
      passwordHash,
      phone,
      role: 'ADMIN',
    })

    await this.usersRepository.create(admin as unknown as User)

    return success({})
  }
}
