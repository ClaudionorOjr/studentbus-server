import { ValueObject } from '@core/entities/value-object'

export interface StudentProfileProps {
  userId: string
  completeName: string
  email: string
  phone: string
  studentId: string
  dateOfBirth: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
  // avatar
}

export class StudentProfile extends ValueObject<StudentProfileProps> {
  get userId() {
    return this.props.userId
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

  get studentId() {
    return this.props.studentId
  }

  get dateOfBirth() {
    return this.props.dateOfBirth
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
