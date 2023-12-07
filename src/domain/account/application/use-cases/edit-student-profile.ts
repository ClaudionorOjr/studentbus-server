import { inject, injectable } from 'tsyringe'
import { Responsible } from '@account/enterprise/entities/responsible'
import { ResponsiblesRepository } from '../repositories/responsibles-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { UsersRepository } from '../repositories/users-repository'
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
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
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

    student.birthdate = birthdate ?? student.birthdate

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

    if (
      !responsible &&
      responsibleName &&
      responsiblePhone &&
      degreeOfKinship
    ) {
      const responsible = Responsible.create({
        userId: student.id,
        responsibleName,
        responsiblePhone,
        degreeOfKinship,
      })

      await this.responsiblesRepository.create(responsible)
    }

    return success({})
  }
}
