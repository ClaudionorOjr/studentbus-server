import { Solicitation } from '@account/enterprise/entities/solicitation'
import { SolicitationsRepository } from '../repositories/solicitations-repository'

interface FetchPendingSolicitationsUseCaseResponse {
  solicitations: Solicitation[]
}

export class FetchPendingSolicitationsUseCase {
  constructor(private solicitationsRepository: SolicitationsRepository) {}

  async execute(): Promise<FetchPendingSolicitationsUseCaseResponse> {
    const solicitations = await this.solicitationsRepository.list()

    return { solicitations }
  }
}
