import { inject, injectable } from 'tsyringe'
import { Responsible } from '@account/enterprise/entities/responsible'
import { ResponsiblesRepository } from '../repositories/responsibles-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

interface EditStudentProfileUseCaseRequest {
  userId: string
  completeName?: string
  phone?: string
  birthdate?: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
}

type EditStudentProfileUseCaseResponse = Either<UnregisteredUserError, object>

@injectable()
export class EditStudentProfileUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: StudentsRepository,
    @inject('ResponsiblesRepository')
    private responsiblesRepository: ResponsiblesRepository,
  ) {}

  async execute({
    userId,
    completeName,
    phone,
    birthdate,
    responsibleName,
    responsiblePhone,
    degreeOfKinship,
  }: EditStudentProfileUseCaseRequest): Promise<EditStudentProfileUseCaseResponse> {
    const student = await this.studentsRepository.findByUserId(userId)

    if (!student) {
      return failure(new UnregisteredUserError())
    }

    student.completeName = completeName ?? student.completeName
    student.phone = phone ?? student.phone
    student.birthdate = birthdate ?? student.birthdate

    await this.studentsRepository.save(student)

    const responsible = await this.responsiblesRepository.findByStudentId(
      student.id,
    )

    if (responsible) {
      responsible.responsibleName =
        responsibleName ?? responsible.responsibleName
      responsible.responsiblePhone =
        responsiblePhone ?? responsible.responsiblePhone
      responsible.degreeOfKinship =
        degreeOfKinship ?? responsible.degreeOfKinship

      await this.responsiblesRepository.save(responsible)
    }

    if (
      !responsible &&
      responsibleName &&
      responsiblePhone &&
      degreeOfKinship
    ) {
      const responsible = Responsible.create({
        studentId: student.id,
        responsibleName,
        responsiblePhone,
        degreeOfKinship,
      })

      await this.responsiblesRepository.create(responsible)
    }

    return success({})
  }
}
