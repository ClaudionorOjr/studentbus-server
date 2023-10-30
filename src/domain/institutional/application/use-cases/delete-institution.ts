import { UsersRepository } from '@account/application/repositories/users-repository'
import { InstitutionsRepository } from '../repositories/institutions-repository'

interface DeleteInstitutionUseCaseRequest {
  userId: string
  institutionId: string
}

export class DeleteInstitutionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private institutionsRepository: InstitutionsRepository,
  ) {}

  async execute({
    userId,
    institutionId,
  }: DeleteInstitutionUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    const institution =
      await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      throw new Error('Institution does not exists.')
    }

    if (!user) {
      throw new Error('User does not exists.')
    }

    if (user.rule !== 'ADMIN') {
      throw new Error('Not allowed.')
    }

    await this.institutionsRepository.delete(institutionId)
  }
}
