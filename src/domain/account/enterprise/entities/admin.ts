import { Entity } from '@core/entities/entity'
import { UserProps } from '@core/entities/user'
import { Optional } from '@core/types/optional'

export class Admin extends Entity<UserProps> {
  /* GETTES & SETTERS */
  get completeName() {
    return this.props.completeName
  }

  set completeName(completeName: string) {
    this.props.completeName = completeName
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  /* METHODS */
  protected touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<UserProps, 'role' | 'createdAt'>, id?: string) {
    const admin = new Admin(
      {
        ...props,
        role: 'ADMIN',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return admin
  }
}
