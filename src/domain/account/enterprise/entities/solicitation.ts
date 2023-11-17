import { Entity } from '@core/entities/entity'
import { UserProps } from '@core/entities/user'
import { Optional } from '@core/types/optional'

// TODO Atualizar a entidade Solicitations com os campos do schema prisma
export interface SolicitationProps
  extends Omit<UserProps, 'role' | 'updatedAt'> {
  birthdate: Date
  responsibleName?: string | null
  responsiblePhone?: string | null
  degreeOfKinship?: string | null
  note?: string | null
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

  get note() {
    return this.props.note
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
