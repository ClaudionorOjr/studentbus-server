import { Institution } from '../../enterprise/entities/institution'
import { InstitutionsRepository } from '../repositories/institutions-repository'

interface RegisterInstitutionUseCaseRequest {
  name: string
}

export class RegisterInstitutionUseCase {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  async execute({ name }: RegisterInstitutionUseCaseRequest): Promise<void> {
    const institutionAlreadyExists =
      await this.institutionsRepository.findByName(name)

    if (institutionAlreadyExists) {
      throw new Error('Institution alread exists.')
    }

    const institution = Institution.create({
      name,
    })

    await this.institutionsRepository.create(institution)
  }
}
