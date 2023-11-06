import { StudentOnList } from '../../enterprise/entities/student-on-list'

export interface StudentListsRepository {
  create(studentOnList: StudentOnList): Promise<void>
  findById(id: string): Promise<StudentOnList | null>
  findManyByRouteListId(routeListId: string): Promise<StudentOnList[]>
  delete(userId: string, routeListId: string): Promise<void>
  deleteManyByRouteListId(routeListId: string): Promise<void>
  save(studentOnList: StudentOnList): Promise<void>
}
