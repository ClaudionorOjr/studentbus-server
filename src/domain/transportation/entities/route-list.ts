import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface RouteListProps {
  driverId: string
  turn: string
  departureTime: string
  returnTime: string
  capacity: number
  route: string[]
  status: boolean
  createdAt: Date
  updatedAt?: Date
}

export class RouteList extends Entity<RouteListProps> {
  get driverId() {
    return this.props.driverId
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

  get route() {
    return this.props.route
  }

  get status() {
    return this.props.status
  }

  set status(status: boolean) {
    this.props.status = status
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<RouteListProps, 'createdAt' | 'status'>,
    id?: string,
  ) {
    const routeList = new RouteList(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? true,
      },
      id,
    )

    return routeList
  }
}
