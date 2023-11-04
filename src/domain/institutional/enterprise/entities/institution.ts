import { Entity } from '@core/entities/entity'

export interface InstitutionProps {
  name: string
}

export class Institution extends Entity<InstitutionProps> {
  /* GETTERS AND SETTERS */
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  static create(props: InstitutionProps, id?: string) {
    const institution = new Institution(props, id)

    return institution
  }
}
