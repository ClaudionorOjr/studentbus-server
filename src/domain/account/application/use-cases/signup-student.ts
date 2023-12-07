import { inject, injectable } from 'tsyringe'
import { UsersRepository } from '../repositories/users-repository'
import { Solicitation } from '@account/enterprise/entities/solicitation'
import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { Hasher } from '@account/cryptography/hasher'
import { Either, failure, success } from '@core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface SignUpStudentUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
  birthdate: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
}

type SignUpStudentUseCaseResponse = Either<UserAlreadyExistsError, object>

@injectable()
export class SignUpStudentUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('Hasher')
    private hashGenerator: Hasher,
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute({
    completeName,
    email,
    password,
    phone,
    birthdate,
    responsibleName,
    responsiblePhone,
    degreeOfKinship,
  }: SignUpStudentUseCaseRequest): Promise<SignUpStudentUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      return failure(new UserAlreadyExistsError())
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const solicitation = Solicitation.create({
      completeName,
      email,
      passwordHash,
      phone,
      birthdate,
      responsibleName,
      responsiblePhone,
      degreeOfKinship,
    })

    await this.solicitationsRepository.create(solicitation)

    return success({})
  }
}
