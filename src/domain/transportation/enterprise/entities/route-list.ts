import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface RouteListProps {
  userId: string
  turn: string
  departureTime: string
  returnTime: string
  capacity: number
  institutions: string[]
  open: boolean
  createdAt: Date
  updatedAt?: Date
}

export class RouteList extends Entity<RouteListProps> {
  /* GETTERS AND SETTERS */
  get userId() {
    return this.props.userId
  }

  get turn() {
    return this.props.turn
  }

  get departureTime() {
    return this.props.departureTime
  }

  get returnTime() {
    return this.props.returnTime
  }

  get capacity() {
    return this.props.capacity
  }

  get institutions() {
    return this.props.institutions
  }

  get open() {
    return this.props.open
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

  public closeList() {
    this.props.open = false
    this.touch()
  }

  static create(
    props: Optional<RouteListProps, 'createdAt' | 'open'>,
    id?: string,
  ) {
    const routeList = new RouteList(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        open: props.open ?? true,
      },
      id,
    )

    return routeList
  }
}
