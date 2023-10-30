import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface StudentListProps {
  listId: string
  studentId: string
  comeBack: boolean
  onBus: boolean
}

export class StudentList extends Entity<StudentListProps> {
  get listId() {
    return this.props.listId
  }

  get studentId() {
    return this.props.studentId
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
    props: Optional<StudentListProps, 'comeBack' | 'onBus'>,
    id?: string,
  ) {
    const studentList = new StudentList(
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
