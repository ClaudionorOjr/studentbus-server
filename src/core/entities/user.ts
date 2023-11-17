import { Optional } from '@core/types/optional'
import { Entity } from './entity'

export interface UserProps {
  completeName: string
  email: string
  passwordHash: string
  phone: string
  role: 'STUDENT' | 'DRIVER' | 'ADMIN'
  createdAt: Date
  updatedAt?: Date | null
  // avatar
}

export class User extends Entity<UserProps> {
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

  static create(props: Optional<UserProps, 'createdAt'>, id?: string) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
