import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { StudentListsRepository } from '@transportation/application/repositories/student-lists-repository'
import { StudentOnList } from '@transportation/enterprise/entities/student-on-list'
import { InMemoryUsersRepository } from './in-memory-users-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryResponsiblesRepository } from './in-memory-responsibles-repository'

export class InMemoryStudentListsRepository implements StudentListsRepository {
  public studentLists: StudentOnList[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private studentsRepository: InMemoryStudentsRepository,
    private responsiblesRepository: InMemoryResponsiblesRepository,
  ) {}

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

  async findManyByRouteListIdWithProfile(
    routeListId: string,
  ): Promise<StudentProfile[]> {
    const students = this.studentLists.filter(
      (studentList) => studentList.listId === routeListId,
    )

    const studentProfiles = students.map((profile) => {
      const user = this.usersRepository.users.find(
        (user) => user.id === profile.userId,
      )
      const student = this.studentsRepository.students.find(
        (student) => student.userId === profile.userId,
      )
      const responsible = this.responsiblesRepository.responsibles.find(
        (responsible) => responsible.userId === profile.userId,
      )

      if (!user || !student) {
        throw new Error(`User with ${profile.userId} does not exist.`)
      }

      return StudentProfile.create({
        userId: user.id,
        completeName: user.completeName,
        email: user.email,
        phone: user.phone,
        studentId: student.id,
        dateOfBirth: student.dateOfBirth,
        responsibleName: responsible?.responsibleName,
        responsiblePhone: responsible?.responsiblePhone,
        degreeOfKinship: responsible?.degreeOfKinship,
      })
    })

    return studentProfiles
  }

  async delete(userId: string, routeListId: string): Promise<void> {
    const studentIndex = this.studentLists.findIndex(
      (studentOnList) =>
        studentOnList.listId === routeListId && studentOnList.userId === userId,
    )

    this.studentLists.splice(studentIndex, 1)
  }

  async deleteManyByRouteListId(routeListId: string): Promise<void> {
    const studentLists = this.studentLists.filter(
      (studentList) => studentList.listId !== routeListId,
    )

    this.studentLists = studentLists
  }

  async save(studentOnList: StudentOnList): Promise<void> {
    const studentOnListIndex = this.studentLists.findIndex(
      (item) => item.id === studentOnList.id,
    )

    this.studentLists[studentOnListIndex] = studentOnList
  }
}
