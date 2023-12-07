import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Student } from '@account/enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { Responsible } from '@account/enterprise/entities/responsible'
import { ResponsiblesRepository } from '../repositories/responsibles-repository'
import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface RegisterStudentUseCaseRequest {
  solicitationId: string
}

type RegisterStudentUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class RegisterStudentUseCase {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('StudentsRepository')
    private studentsRepository: StudentsRepository,
    @inject('ResponsiblesRepository')
    private responsiblesRepository: ResponsiblesRepository,
  ) {}

  async execute({
    solicitationId,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const solicitation =
      await this.solicitationsRepository.findById(solicitationId)

    if (!solicitation) {
      return failure(new ResourceNotFoundError())
    }

    const user = User.create(
      {
        completeName: solicitation.completeName,
        email: solicitation.email,
        passwordHash: solicitation.passwordHash,
        phone: solicitation.phone,
        role: 'STUDENT',
      },
      solicitation.id,
    )

    await this.usersRepository.create(user)

    const student = Student.create(
      {
        birthdate: solicitation.birthdate,
      },
      user.id,
    )

    await this.studentsRepository.create(student)

    if (solicitation.responsibleName) {
      const responsible = Responsible.create({
        userId: user.id,
        responsibleName: solicitation.responsibleName,
        responsiblePhone: solicitation.responsiblePhone!,
        degreeOfKinship: solicitation.degreeOfKinship!,
      })

      await this.responsiblesRepository.create(responsible)
    }

    await this.solicitationsRepository.delete(solicitation.id)

    return success({})
  }
}
