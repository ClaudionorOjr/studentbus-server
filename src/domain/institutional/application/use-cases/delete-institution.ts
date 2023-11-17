import { UsersRepository } from '@account/application/repositories/users-repository'
import { InstitutionsRepository } from '../repositories/institutions-repository'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UnregisteredInstitutionError } from './errors/unregistered-institution-error'
import { Either, failure, success } from '@core/either'
import { NotAllowedError } from '@core/errors/not-allowerd-error'

interface DeleteInstitutionUseCaseRequest {
  userId: string
  institutionId: string
}

type DeleteInstitutionUseCaseResponse = Either<
  UnregisteredUserError | UnregisteredInstitutionError | NotAllowedError,
  object
>

export class DeleteInstitutionUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private institutionsRepository: InstitutionsRepository,
  ) {}

  async execute({
    userId,
    institutionId,
  }: DeleteInstitutionUseCaseRequest): Promise<DeleteInstitutionUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    const institution =
      await this.institutionsRepository.findById(institutionId)

    if (!user) {
      // throw new Error('User does not exists.')
      return failure(new UnregisteredUserError())
    }

    if (user.role !== 'ADMIN') {
      // throw new Error('Not allowed.')
      return failure(new NotAllowedError())
    }

    if (!institution) {
      // throw new Error('Institution does not exists.')
      return failure(new UnregisteredInstitutionError())
    }

    await this.institutionsRepository.delete(institutionId)

    return success({})
  }
}
