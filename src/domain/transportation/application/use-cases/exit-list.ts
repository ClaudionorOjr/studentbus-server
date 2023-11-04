import { RouteListsRepository } from '../repositories/route-lists-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'

interface ExitListUseCaseRequest {
  userId: string
  listId: string
}

export class ExitListUseCase {
  constructor(
    private studentListsRepository: StudentListsRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({ userId, listId }: ExitListUseCaseRequest): Promise<void> {
    const routeList = await this.routeListsRepository.findById(listId)

    if (!routeList) {
      throw new Error('Resource not found.')
    }

    if (!routeList.open) {
      throw new Error('Not allowed')
    }

    const student = (
      await this.studentListsRepository.findManyByRouteListId(listId)
    ).find((studentList) => studentList.userId === userId)

    if (!student) {
      throw new Error('User is not on the list.')
    }

    await this.studentListsRepository.delete(userId, listId)
  }
}
