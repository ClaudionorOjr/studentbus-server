import { UsersRepository } from '../repositories/users-repository'
import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { Solicitation } from '@account/enterprise/entities/solicitation'
import { HashGenerator } from '@account/cryptography/hash-generator'

interface SignUpStudentUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
  dateOfBirth: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
}

export class SignUpStudentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute({
    completeName,
    email,
    password,
    phone,
    dateOfBirth,
    responsibleName,
    responsiblePhone,
    degreeOfKinship,
  }: SignUpStudentUseCaseRequest): Promise<void> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists!')
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const solicitation = Solicitation.create({
      completeName,
      email,
      passwordHash,
      phone,
      dateOfBirth,
      responsibleName,
      responsiblePhone,
      degreeOfKinship,
    })

    await this.solicitationsRepository.create(solicitation)
  }
}
