import { UsersRepository } from '@account/application/repositories/users-repository'
import { Bond } from '../../enterprise/entities/bond'
import { BondsRepository } from '../repositories/bonds-repository'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

interface FetchStudentBondsUseCaseRequest {
  userId: string
}

type FetchStudentBondsUseCaseResponse = Either<
  UnregisteredUserError,
  {
    bonds: Bond[]
  }
>

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
      // throw new Error('User does not exist.')
      return failure(new UnregisteredUserError())
    }

    const bonds = await this.bondsRepository.findManyByUserId(userId)

    return success({ bonds })
  }
}
