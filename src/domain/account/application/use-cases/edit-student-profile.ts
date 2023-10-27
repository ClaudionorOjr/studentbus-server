import { ResponsiblesRepository } from '../repositories/responsibles-repository'
import { StudentsRepository } from '../repositories/students-repository'
import { UsersRepository } from '../repositories/users-repository'

interface EditStudentProfileUseCaseRequest {
  userId: string
  completeName?: string
  phone?: string
  dateOfBirth?: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
}

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
  }: EditStudentProfileUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User not found.')
    }

    const student = await this.studentsRepository.findByUserId(userId)

    if (!student) {
      throw new Error('Student not found.')
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
  }
}
