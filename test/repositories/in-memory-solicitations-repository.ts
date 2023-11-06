import { SolicitationsRepository } from '@account/application/repositories/solicitations-repository'
import { Solicitation } from '@account/enterprise/entities/solicitation'

export class InMemorySolicitationsRepository
  implements SolicitationsRepository
{
  public solicitations: Solicitation[] = []

  async create(solicitation: Solicitation): Promise<void> {
    this.solicitations.push(solicitation)
  }

  async findById(id: string): Promise<Solicitation | null> {
    const solicication = this.solicitations.find((item) => item.id === id)

    if (!solicication) {
      return null
    }

    return solicication
  }

  // ! Só está retornando as solicitações que estão como pendentes
  async list(): Promise<Solicitation[]> {
    return this.solicitations.filter(
      (solicitation) => solicitation.status === 'PENDING',
    )
  }

  async delete(id: string): Promise<void> {
    const solicitionIndex = this.solicitations.findIndex(
      (solicitation) => solicitation.id === id,
    )

    this.solicitations.splice(solicitionIndex, 1)
  }
}
