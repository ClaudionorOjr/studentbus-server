import { StudentsRepository } from '@account/application/repositories/students-repository'
import { Student, StudentProps } from '@account/enterprise/entities/student'
import { InMemoryUsersRepository } from './in-memory-users-repository'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'
import { InMemoryResponsiblesRepository } from './in-memory-responsibles-repository'
import { User, UserProps } from '@core/entities/user'

type StudentsRepositoryProps = { id: string } & Omit<
  StudentProps,
  keyof UserProps
>

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: StudentsRepositoryProps[] = []

  constructor(
    private usersRepository: InMemoryUsersRepository,
    private responsiblesRepository: InMemoryResponsiblesRepository,
  ) {}

  async create(student: Student): Promise<void> {
    const user = User.create(
      {
        completeName: student.completeName,
        email: student.email,
        passwordHash: student.passwordHash,
        phone: student.phone,
        role: student.role,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
      student.id,
    )

    this.usersRepository.create(user)

    this.students.push({
      id: student.id,
      birthdate: student.birthdate,
      validatedAt: student.validatedAt,
    })
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const user = await this.usersRepository.findById(userId)
    const student = this.students.find((student) => student.id === userId)

    if (!user || !student) {
      return null
    }

    return Student.create(
      {
        completeName: user.completeName,
        email: user.email,
        passwordHash: user.passwordHash,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        birthdate: student.birthdate,
        validatedAt: student.validatedAt,
      },
      user.id,
    )
  }

  async getProfile(userId: string): Promise<StudentProfile | null> {
    const user = await this.usersRepository.findById(userId)
    const student = this.students.find((student) => student.id === userId)

    if (!user || !student) {
      return null
    }

    const responsible = this.responsiblesRepository.responsibles.find(
      (responsible) => responsible.studentId === student.id,
    )

    return StudentProfile.create({
      studentId: student.id,
      completeName: user.completeName,
      email: user.email,
      phone: user.phone,
      birthdate: student.birthdate,
      responsibleName: responsible?.responsibleName,
      responsiblePhone: responsible?.responsiblePhone,
      degreeOfKinship: responsible?.degreeOfKinship,
    })
  }

  async save(student: Student): Promise<void> {
    const user = User.create(
      {
        completeName: student.completeName,
        email: student.email,
        passwordHash: student.passwordHash,
        phone: student.phone,
        role: student.role,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      },
      student.id,
    )

    await this.usersRepository.save(user)

    const userIndex = this.students.findIndex((user) => user.id === student.id)

    this.students[userIndex] = {
      id: student.id,
      birthdate: student.birthdate,
      validatedAt: student.validatedAt,
    }
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id)
    const userIndex = this.students.findIndex((student) => student.id === id)

    this.students.splice(userIndex, 1)
  }
}
