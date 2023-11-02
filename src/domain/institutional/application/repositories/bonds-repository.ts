import { Bond } from '../../enterprise/entities/bond'

export interface BondsRepository {
  create(bond: Bond): Promise<void>
  findManyByUserId(userId: string): Promise<Bond[]>
}
