import { UsersRepository } from '@account/application/repositories/users-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'

interface ToggleComeBackUseCaseRequest {
  userId: string
  studentListId: string
}

export class ToggleComeBackUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
    private studentListsRepository: StudentListsRepository,
  ) {}

  async execute({
    userId,
    studentListId,
  }: ToggleComeBackUseCaseRequest): Promise<void> {
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

    const routeList = await this.routeListsRepository.findById(
      studentList.listId,
    )

    if (!routeList) {
      throw new Error('Resource not found.')
    }

    if (!routeList.open) {
      throw new Error('Not allowed.')
    }

    studentList.toggleComeBack()

    await this.studentListsRepository.save(studentList)
  }
}
