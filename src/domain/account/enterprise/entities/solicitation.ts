import { Entity } from '@core/entities/entity'
import { UserProps } from '@core/entities/user'
import { Optional } from '@core/types/optional'

export interface SolicitationProps
  extends Omit<UserProps, 'rule' | 'updatedAt'> {
  dateOfBirth: Date
  responsibleName?: string
  responsiblePhone?: string
  degreeOfKinship?: string
  status: 'PENDING' | 'REFUSED'
}

export class Solicitation extends Entity<SolicitationProps> {
  /* GETTERS */
  get completeName() {
    return this.props.completeName
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  get phone() {
    return this.props.phone
  }

  get createdAt() {
    return this.props.createdAt
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

  get status() {
    return this.props.status
  }

  static create(
    props: Optional<SolicitationProps, 'createdAt' | 'status'>,
    id?: string,
  ) {
    const solicication = new Solicitation(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return solicication
  }
}
