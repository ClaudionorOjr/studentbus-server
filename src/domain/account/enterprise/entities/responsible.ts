import { Entity } from '@core/entities/entity'

export interface ResponsibleProps {
  studentId: string
  responsibleName: string
  responsiblePhone: string
  degreeOfKinship: string
}

export class Responsible extends Entity<ResponsibleProps> {
  get studentId() {
    return this.props.studentId
  }

  get responsibleName() {
    return this.props.responsibleName
  }

  set responsibleName(responsibleName: string) {
    this.props.responsibleName = responsibleName
  }

  get responsiblePhone() {
    return this.props.responsiblePhone
  }

  set responsiblePhone(responsiblePhone: string) {
    this.props.responsiblePhone = responsiblePhone
  }

  get degreeOfKinship() {
    return this.props.degreeOfKinship
  }

  set degreeOfKinship(degreeOfKinship: string) {
    this.props.degreeOfKinship = degreeOfKinship
  }

  static create(props: ResponsibleProps, id?: string) {
    const responsible = new Responsible(props, id)

    return responsible
  }
}
