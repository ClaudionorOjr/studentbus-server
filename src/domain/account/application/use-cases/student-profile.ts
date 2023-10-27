import { StudentsRepository } from '../repositories/students-repository'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'

export interface StudentProfileUseCaseRequest {
  userId: string
}

export interface StudentProfileUseCaseResponse {
  studentProfile: StudentProfile
}

export class StudentProfileUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    userId,
  }: StudentProfileUseCaseRequest): Promise<StudentProfileUseCaseResponse> {
    const studentProfile = await this.studentsRepository.getProfile(userId)

    if (!studentProfile) {
      throw new Error('Not found.')
    }

    return { studentProfile }
  }
}
