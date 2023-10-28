import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export type Weekdays =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'

export interface BondProps {
  institutionId: string
  userId: string
  course: string
  period?: string // ! Devo deixar como opcional?
  turn: 'MORNING' | 'NIGHT' | 'FULL TIME'
  weekdays: Weekdays[]
  // statementOfAffiliation: File
  createdAt: Date
  updatedAt?: Date
}

export class Bond extends Entity<BondProps> {
  /* GETTERS AND SETTERS */
  get institutionId() {
    return this.props.institutionId
  }

  get userId() {
    return this.props.userId
  }

  get course() {
    return this.props.course
  }

  set course(course: string) {
    this.props.course = course
    this.touch()
  }

  get period() {
    return this.props.period
  }

  set period(period: string | undefined) {
    this.props.period = period
    this.touch()
  }

  get turn() {
    return this.props.turn
  }

  set turn(turn: 'MORNING' | 'NIGHT' | 'FULL TIME') {
    this.props.turn = turn
    this.touch()
  }

  get weekdays() {
    return this.props.weekdays
  }

  set weekdays(weekdays: Weekdays[]) {
    this.props.weekdays = weekdays
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

  static create(props: Optional<BondProps, 'createdAt'>, id?: string) {
    const bond = new Bond(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return bond
  }
}
