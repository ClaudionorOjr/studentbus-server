import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { StudentListsRepository } from '../repositories/student-lists-repository'
import { StudentOnList } from '../../enterprise/entities/student-on-list'

interface EnterListUseCaseRequest {
  userId: string
  listId: string
}

export class EnterListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private routeListsRepository: RouteListsRepository,
    private studentListsRepository: StudentListsRepository,
  ) {}

  async execute({ userId, listId }: EnterListUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    const routeList = await this.routeListsRepository.findById(listId)

    if (!user) {
      throw new Error('User not found.')
    }

    if (user.rule !== 'STUDENT') {
      throw new Error('Not allowed')
    }

    if (!routeList) {
      throw new Error('Resource not found.')
    }

    if (!routeList.open) {
      throw new Error('Not allowed')
    }

    const student = (
      await this.studentListsRepository.findManyByRouteListId(listId)
    ).find((studentList) => studentList.userId === userId)

    if (student) {
      throw new Error('User is already on the list')
    }

    const studentOnList = StudentOnList.create({
      userId,
      listId,
    })

    await this.studentListsRepository.create(studentOnList)
  }
}
