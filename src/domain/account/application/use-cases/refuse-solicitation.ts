import { Either, failure, success } from '@core/either'
import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface RefuseSolicitationUseCaseRequest {
  solicitationId: string
  refuseReason: string
}

type RefuseSolicitationUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class RefuseSolicitationUseCase {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute({
    solicitationId,
    refuseReason,
  }: RefuseSolicitationUseCaseRequest): Promise<RefuseSolicitationUseCaseResponse> {
    const solicitation =
      await this.solicitationsRepository.findById(solicitationId)

    if (!solicitation) {
      return failure(new ResourceNotFoundError())
    }

    solicitation.refuse(refuseReason)

    await this.solicitationsRepository.save(solicitation)

    return success({})
  }
}
