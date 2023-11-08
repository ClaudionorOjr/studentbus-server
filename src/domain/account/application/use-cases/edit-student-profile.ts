import { Either, failure, success } from '@core/either'
import { ResponsiblesRepository } from '../repositories/responsibles-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

interface EditStudentProfileUseCaseRequest {
  userId: string
  completeName?: string
  phone?: string
  dateOfBirth?: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
}

type EditStudentProfileUseCaseResponse = Either<UnregisteredUserError, object>

export class EditStudentProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private studentsRepository: StudentsRepository,
    private responsiblesRepository: ResponsiblesRepository,
  ) {}

  async execute({
    userId,
    completeName,
    phone,
    dateOfBirth,
    responsibleName,
    responsiblePhone,
    degreeOfKinship,
  }: EditStudentProfileUseCaseRequest): Promise<EditStudentProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return failure(new UnregisteredUserError())
    }

    const student = await this.studentsRepository.findByUserId(userId)

    if (!student) {
      return failure(new UnregisteredUserError())
    }

    user.completeName = completeName ?? user.completeName
    user.phone = phone ?? user.phone

    student.dateOfBirth = dateOfBirth ?? student.dateOfBirth

    await this.usersRepository.save(user)
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

    return success({})
  }
}
