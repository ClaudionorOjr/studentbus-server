import { Solicitation } from '@account/enterprise/entities/solicitation'

export interface SolicitationsRepository {
  create(solicitation: Solicitation): Promise<void>
  findById(id: string): Promise<Solicitation | null>
  list(): Promise<Solicitation[]>
  save(solicitation: Solicitation): Promise<void>
  delete(id: string): Promise<void>
}
