import { InstitutionsRepository } from '../repositories/institutions-repository'

interface EditInstitutionUseCaseRequest {
  institutionId: string
  name: string
}

export class EditInstitutionUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({
    institutionId,
    name,
  }: EditInstitutionUseCaseRequest): Promise<void> {
    const institution =
      await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      throw new Error('Not found.')
    }

    institution.name = name

    await this.institutionsRepository.save(institution)
  }
}
