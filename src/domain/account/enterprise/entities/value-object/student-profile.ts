import { ValueObject } from '@core/entities/value-object'

export interface StudentProfileProps {
  studentId: string
  completeName: string
  email: string
  phone: string
  birthdate: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
  // avatar
}

export class StudentProfile extends ValueObject<StudentProfileProps> {
  get studentId() {
    return this.props.studentId
  }

  get completeName() {
    return this.props.completeName
  }

  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  get birthdate() {
    return this.props.birthdate
  }

  get responsibleName() {
    return this.props.responsibleName
  }

  get responsiblePhone() {
    return this.props.responsiblePhone
  }

  get degreeOfKinship() {
    return this.props.degreeOfKinship
  }

  static create(props: StudentProfileProps) {
    return new StudentProfile(props)
  }
}
