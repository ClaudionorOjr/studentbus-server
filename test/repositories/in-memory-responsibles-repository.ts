import { ResponsiblesRepository } from '@account/application/repositories/responsibles-repository'
import { Responsible } from '@account/enterprise/entities/responsible'

export class InMemoryResponsiblesRepository implements ResponsiblesRepository {
  public responsibles: Responsible[] = []

  async create(responsible: Responsible): Promise<void> {
    this.responsibles.push(responsible)
  }

  async findByStudentId(userId: string): Promise<Responsible | null> {
    const responsible = this.responsibles.find(
      (responsible) => responsible.userId === userId,
    )

    if (!responsible) {
      return null
    }

    return responsible
  }

  async save(responsible: Responsible): Promise<void> {
    const userIndex = this.responsibles.findIndex(
      (user) => user.id === responsible.id,
    )

    this.responsibles[userIndex] = responsible
  }
}
