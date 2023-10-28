import { PaginationParams } from '@core/repositories/pagination-params'
import { InstitutionsRepository } from 'src/domain/institutional/application/repositories/institutions-repository'
import { Institution } from 'src/domain/institutional/enterprise/entities/institution'

export class InMemoryInstitutionsRepository implements InstitutionsRepository {
  public institutions: Institution[] = []

  async create(institution: Institution): Promise<void> {
    this.institutions.push(institution)
  }

  async findByName(name: string): Promise<Institution | null> {
    const institution = this.institutions.find(
      (institution) => institution.name === name,
    )

    if (!institution) {
      return null
    }

    return institution
  }

  async findById(id: string): Promise<Institution | null> {
    const institution = this.institutions.find(
      (institution) => institution.id === id,
    )

    if (!institution) {
      return null
    }

    return institution
  }

  async list({ page }: PaginationParams): Promise<Institution[]> {
    return this.institutions.slice((page - 1) * 10, page * 10)
  }

  async delete(id: string): Promise<void> {
    const institutionIndex = this.institutions.findIndex(
      (institution) => institution.id === id,
    )

    this.institutions.splice(institutionIndex, 1)
  }

  async save(institution: Institution): Promise<void> {
    const institutionIndex = this.institutions.findIndex(
      (item) => item.id === institution.id,
    )

    this.institutions[institutionIndex] = institution
  }
}
