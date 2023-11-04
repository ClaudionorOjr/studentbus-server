import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface StudentOnListProps {
  listId: string
  userId: string
  comeBack: boolean
  onBus: boolean
}

export class StudentOnList extends Entity<StudentOnListProps> {
  get listId() {
    return this.props.listId
  }

  get userId() {
    return this.props.userId
  }

  get comeBack() {
    return this.props.comeBack
  }

  toggleComeBack() {
    this.props.comeBack = !this.props.comeBack
  }

  get onBus() {
    return this.props.onBus
  }

  toggleOnBus() {
    this.props.onBus = !this.props.onBus
  }

  static create(
    props: Optional<StudentOnListProps, 'comeBack' | 'onBus'>,
    id?: string,
  ) {
    const studentList = new StudentOnList(
      {
        ...props,
        comeBack: props.comeBack ?? true,
        onBus: props.onBus ?? false,
      },
      id,
    )

    return studentList
  }
}
