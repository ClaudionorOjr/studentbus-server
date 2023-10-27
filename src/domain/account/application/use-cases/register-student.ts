import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { User } from '@core/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { Student } from '@account/enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { Responsible } from '@account/enterprise/entities/responsible'
import { ResponsiblesRepository } from '../repositories/responsibles-repository'

interface RegisterStudentUseCaseRequest {
  solicitationId: string
}

export class RegisterStudentUseCase {
  constructor(
    private solicitationsRepository: SolicitationsRepository,
    private usersRepository: UsersRepository,
    private studentsRepository: StudentsRepository,
    private responsiblesRepository: ResponsiblesRepository,
  ) {}

  async execute({ solicitationId }: RegisterStudentUseCaseRequest) {
    const solicitation =
      await this.solicitationsRepository.findById(solicitationId)

    if (!solicitation) {
      throw new Error('Not found.')
    }

    const user = User.create(
      {
        completeName: solicitation.completeName,
        email: solicitation.email,
        passwordHash: solicitation.passwordHash,
        phone: solicitation.phone,
        rule: 'STUDENT',
      },
      solicitation.id,
    )

    await this.usersRepository.create(user)

    const student = Student.create({
      userId: user.id,
      dateOfBirth: solicitation.dateOfBirth,
    })

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
  }
}
