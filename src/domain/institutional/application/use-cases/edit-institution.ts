import { Either, failure, success } from '@core/either'
import { InstitutionsRepository } from '../repositories/institutions-repository'
import { UnregisteredInstitutionError } from './errors/unregistered-institution-error'

interface EditInstitutionUseCaseRequest {
  institutionId: string
  name: string
}

type EditInstitutionUseCaseResponse = Either<
  UnregisteredInstitutionError,
  object
>

export class EditInstitutionUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({
    institutionId,
    name,
  }: EditInstitutionUseCaseRequest): Promise<EditInstitutionUseCaseResponse> {
    const institution =
      await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      // throw new Error('Not found.')
      return failure(new UnregisteredInstitutionError())
    }

    institution.name = name

    await this.institutionsRepository.save(institution)

    return success({})
  }
}
