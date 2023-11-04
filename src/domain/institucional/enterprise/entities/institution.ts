import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface InstitutionProps {
  name: string
  createdAt: Date
  updatedAt?: Date
}

export class Institution extends Entity<InstitutionProps> {
  /* GETTERS AND SETTERS */
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  /* METHODS */
  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<InstitutionProps, 'createdAt'>, id?: string) {
    const institution = new Institution(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return institution
  }
}
