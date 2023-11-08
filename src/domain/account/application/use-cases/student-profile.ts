import { Either, failure, success } from '@core/either'
import { StudentsRepository } from '../repositories/students-repository'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

export interface StudentProfileUseCaseRequest {
  userId: string
}

type StudentProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    studentProfile: StudentProfile
  }
>

export class StudentProfileUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    userId,
  }: StudentProfileUseCaseRequest): Promise<StudentProfileUseCaseResponse> {
    const studentProfile = await this.studentsRepository.getProfile(userId)

    if (!studentProfile) {
      return failure(new ResourceNotFoundError())
    }

    return success({ studentProfile })
  }
}
