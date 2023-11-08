import { Solicitation } from '@account/enterprise/entities/solicitation'
import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { Either, success } from '@core/either'

type FetchPendingSolicitationsUseCaseResponse = Either<
  null,
  {
    solicitations: Solicitation[]
  }
>

export class FetchPendingSolicitationsUseCase {
  constructor(private solicitationsRepository: SolicitationsRepository) {}

  async execute(): Promise<FetchPendingSolicitationsUseCaseResponse> {
    const solicitations = await this.solicitationsRepository.list()

    return success({ solicitations })
  }
}
