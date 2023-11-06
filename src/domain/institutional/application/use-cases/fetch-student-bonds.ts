import { UsersRepository } from '@account/application/repositories/users-repository'
import { Bond } from '../../enterprise/entities/bond'
import { BondsRepository } from '../repositories/bonds-repository'

interface FetchStudentBondsUseCaseRequest {
  userId: string
}

interface FetchStudentBondsUseCaseResponse {
  bonds: Bond[]
}

export class FetchStudentBondsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private bondsRepository: BondsRepository,
  ) {}

  async execute({
    userId,
  }: FetchStudentBondsUseCaseRequest): Promise<FetchStudentBondsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User does not exist.')
    }

    const bonds = await this.bondsRepository.findManyByUserId(userId)

    return { bonds }
  }
}
