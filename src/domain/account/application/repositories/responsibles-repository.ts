import { Responsible } from '@account/enterprise/entities/responsible'

export interface ResponsiblesRepository {
  create(responsible: Responsible): Promise<void>
  findByStudentId(studentId: string): Promise<Responsible | null>
  save(responsible: Responsible): Promise<void>
  delete(id: string): Promise<void>
}
