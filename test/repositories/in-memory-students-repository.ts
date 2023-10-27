import { StudentsRepository } from '@account/application/repositories/students-repository'
import { Student } from '@account/enterprise/entities/student'
import { InMemoryUsersRepository } from './in-memory-users-repository'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { InMemoryResponsiblesRepository } from './in-memory-responsibles-repository'

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private responsiblesRepository: InMemoryResponsiblesRepository,
  ) {}

  async create(student: Student): Promise<void> {
    this.students.push(student)
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const student = this.students.find((student) => student.userId === userId)

    if (!student) {
      return null
    }

    return student
  }

  async getProfile(userId: string): Promise<StudentProfile | null> {
    const user = this.usersRepository.users.find((user) => user.id === userId)
    const student = await this.findByUserId(userId)

    if (!user || !student) {
      return null
    }

    const responsible = await this.responsiblesRepository.findByStudentId(
      student.id,
    )

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
  }

  async save(student: Student): Promise<void> {
    const userIndex = this.students.findIndex((user) => user.id === student.id)

    this.students[userIndex] = student
  }
}
