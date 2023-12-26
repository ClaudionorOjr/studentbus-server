import { Either, failure, success } from '@core/either'
import { Institution } from '../../enterprise/entities/institution'
import { InstitutionsRepository } from '../repositories/institutions-repository'
import { InstitutionAlreadyExistsError } from './errors/institution-already-exists-error'
import { inject, injectable } from 'tsyringe'

interface RegisterInstitutionUseCaseRequest {
  name: string
}

type RegisterInstitutionUseCaseResponse = Either<
  InstitutionAlreadyExistsError,
  object
>

@injectable()
export class RegisterInstitutionUseCase {
  constructor(
    @inject('InstitutionsRepository')
    private institutionsRepository: InstitutionsRepository,
  ) {}

  async execute({
    name,
  }: RegisterInstitutionUseCaseRequest): Promise<RegisterInstitutionUseCaseResponse> {
    const institutionAlreadyExists =
      await this.institutionsRepository.findByName(name)

    if (institutionAlreadyExists) {
      // throw new Error('Institution alread exists.')
      return failure(new InstitutionAlreadyExistsError())
    }

    const institution = Institution.create({
      name,
    })

    await this.institutionsRepository.create(institution)

    return success({})
  }
}
