import { StudentListsRepository } from 'src/domain/transportation/application/repositories/student-lists-repository'
import { StudentOnList } from 'src/domain/transportation/enterprise/entities/student-on-list'

export class InMemoryStudentListsRepository implements StudentListsRepository {
  public studentLists: StudentOnList[] = []

  async create(studentOnList: StudentOnList): Promise<void> {
    this.studentLists.push(studentOnList)
  }

  async findById(id: string): Promise<StudentOnList | null> {
    const studentList = this.studentLists.find(
      (studentList) => studentList.id === id,
    )

    if (!studentList) {
      return null
    }

    return studentList
  }

  async findManyByRouteListId(routeListId: string): Promise<StudentOnList[]> {
    return this.studentLists.filter(
      (studentList) => studentList.listId === routeListId,
    )
  }

  async delete(userId: string, routeListId: string): Promise<void> {
    const studentIndex = this.studentLists.findIndex(
      (studentOnList) =>
        studentOnList.listId === routeListId && studentOnList.userId === userId,
    )

    this.studentLists.splice(studentIndex, 1)
  }

  async save(studentOnList: StudentOnList): Promise<void> {
    const studentOnListIndex = this.studentLists.findIndex(
      (item) => item.id === studentOnList.id,
    )

    this.studentLists[studentOnListIndex] = studentOnList
  }
}
