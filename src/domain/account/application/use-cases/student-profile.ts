import { inject, injectable } from 'tsyringe'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { StudentsRepository } from '../repositories/students-repository'
import { Either, failure, success } from '@core/either'
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

@injectable()
export class StudentProfileUseCase {
  constructor(
    @inject('StudentsRepository')
    private studentsRepository: StudentsRepository,
  ) {}

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
