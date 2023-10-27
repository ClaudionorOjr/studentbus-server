import { Student } from '@account/enterprise/entities/student'
import { StudentProfile } from '@account/enterprise/entities/value-object/student-profile'

export interface StudentsRepository {
  create(student: Student): Promise<void>
  findByUserId(userId: string): Promise<Student | null>
  getProfile(userId: string): Promise<StudentProfile | null>
  save(student: Student): Promise<void>
}
