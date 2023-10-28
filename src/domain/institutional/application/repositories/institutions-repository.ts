import { PaginationParams } from '@core/repositories/pagination-params'
import { Institution } from '../../enterprise/entities/institution'

export interface InstitutionsRepository {
  create(institution: Institution): Promise<void>
  findByName(name: string): Promise<Institution | null>
  findById(id: string): Promise<Institution | null>
  list(params: PaginationParams): Promise<Institution[]>
  delete(id: string): Promise<void>
  save(institution: Institution): Promise<void>
}
