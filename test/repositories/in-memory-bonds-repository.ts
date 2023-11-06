import { BondsRepository } from 'src/domain/institutional/application/repositories/bonds-repository'
import { Bond } from 'src/domain/institutional/enterprise/entities/bond'

export class InMemoryBondsRepository implements BondsRepository {
  public bonds: Bond[] = []

  async create(bond: Bond): Promise<void> {
    this.bonds.push(bond)
  }

  async findManyByUserId(userId: string): Promise<Bond[]> {
    const bonds = this.bonds.filter((bond) => bond.userId === userId)

    return bonds
  }
}
