import { inject, injectable } from 'tsyringe'
import { Solicitation } from '@account/enterprise/entities/solicitation'
import { SolicitationsRepository } from '../repositories/solicitations-repository'
import { Either, success } from '@core/either'

type FetchPendingSolicitationsUseCaseResponse = Either<
  null,
  {
    solicitations: Solicitation[]
  }
>

@injectable()
export class FetchPendingSolicitationsUseCase {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute(): Promise<FetchPendingSolicitationsUseCaseResponse> {
    const solicitations = await this.solicitationsRepository.list()

    return success({ solicitations })
  }
}
