import { UsersRepository } from '@account/application/repositories/users-repository'
import { Bond, Weekdays } from '../../enterprise/entities/bond'
import { InstitutionsRepository } from '../repositories/institutions-repository'
import { BondsRepository } from '../repositories/bonds-repository'

interface CreateBondUseCaseRequest {
  institutionId: string
  userId: string
  course: string
  period?: string
  turn: 'MORNING' | 'NIGHT' | 'FULL TIME'
  weekdays: Weekdays[]
}

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
  }: CreateBondUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('Student does not exists')
    }

    const institution =
      await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      throw new Error('Institution does not exists')
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
  }
}
