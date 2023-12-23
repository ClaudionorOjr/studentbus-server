import { SolicitationsRepository } from '../repositories/solicitations-repository'
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

    const student = Student.create(
      {
        completeName: solicitation.completeName,
        email: solicitation.email,
        passwordHash: solicitation.passwordHash,
        phone: solicitation.phone,
        birthdate: solicitation.birthdate,
        createdAt: solicitation.createdAt,
      },
      solicitation.id,
    )

    await this.studentsRepository.create(student)

    if (solicitation.responsibleName && solicitation.responsiblePhone) {
      const responsible = Responsible.create({
        studentId: student.id,
        responsibleName: solicitation.responsibleName,
        responsiblePhone: solicitation.responsiblePhone,
        degreeOfKinship: solicitation.degreeOfKinship!,
      })

      await this.responsiblesRepository.create(responsible)
    }

    await this.solicitationsRepository.delete(solicitation.id)

    return success({})
  }
}
