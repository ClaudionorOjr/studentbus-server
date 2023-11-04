import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'

interface ToggleOnBusUseCaseRequest {
  userId: string
  studentListId: string
}

export class ToggleOnBusUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
    private studentListsRepository: StudentListsRepository,
  ) {}

  async execute({
    userId,
    studentListId,
  }: ToggleOnBusUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User does not exist.')
    }

    const studentList =
      await this.studentListsRepository.findById(studentListId)

    if (!studentList) {
      throw new Error('Resource not found.')
    }

    if (studentList.userId !== userId) {
      throw new Error('Not allowed.')
    }

    if (!studentList.comeBack) {
      throw new Error('Not allowed.')
    }

    const routeList = await this.routeListsRepository.findById(
      studentList.listId,
    )

    if (!routeList) {
      throw new Error('Resource not found.')
    }

    if (!routeList.open) {
      throw new Error('Not allowed.')
    }

    studentList.toggleOnBus()

    await this.studentListsRepository.save(studentList)
  }
}
