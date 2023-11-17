import { UsersRepository } from '@account/application/repositories/users-repository'
import { InstitutionsRepository } from '../repositories/institutions-repository'
import { Bond } from '../../enterprise/entities/bond'
import { BondsRepository } from '../repositories/bonds-repository'
import { Weekdays } from '@core/types/weekdays'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UnregisteredInstitutionError } from './errors/unregistered-institution-error'
import { NotAllowedError } from '@core/errors/not-allowerd-error'

interface CreateBondUseCaseRequest {
  institutionId: string
  userId: string
  course: string
  period?: string
  turn: 'MORNING' | 'NIGHT' | 'FULL TIME'
  weekdays: Weekdays[]
}

type CreateBondUseCaseResponse = Either<
  UnregisteredUserError | NotAllowedError,
  object
>

export class CreateBondUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private institutionsRepository: InstitutionsRepository,
    private bondsRepository: BondsRepository,
  ) {}

  async execute({
    userId,
    institutionId,
    course,
    turn,
    period,
    weekdays,
  }: CreateBondUseCaseRequest): Promise<CreateBondUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      // throw new Error('Student does not exists')
      return failure(new UnregisteredUserError())
    }

    if (user.role !== 'STUDENT') {
      // throw new Error('Non-student users cannot have bonds.')
      return failure(new NotAllowedError())
    }

    const institution =
      await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      // throw new Error('Institution does not exists')
      return failure(new UnregisteredInstitutionError())
    }

    const bond = Bond.create({
      userId,
      institutionId,
      course,
      turn,
      period,
      weekdays,
    })

    await this.bondsRepository.create(bond)

    return success({})
  }
}
