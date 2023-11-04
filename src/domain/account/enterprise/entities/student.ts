import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'
import dayjs from 'dayjs'

export interface StudentProps {
  userId: string
  dateOfBirth: Date
  validatedAt: Date
}

export class Student extends Entity<StudentProps> {
  /* GETTERS & SETTERS */
  get userId() {
    return this.props.userId
  }

  get dateOfBirth() {
    return this.props.dateOfBirth
  }

  set dateOfBirth(dateOfBirth: Date) {
    this.props.dateOfBirth = dateOfBirth
  }

  get validatedAt() {
    return this.props.validatedAt
  }

  /* METHODS */
  age() {
    return dayjs().diff(this.dateOfBirth, 'year')
  }

  // ! Rever a funcionalidade de validação do cadastro
  // public validate() {
  //   this.props.validatedAt = new Date()
  // }

  /* 
    TODO Mecanismo de expiração, no ano seguinte ao ano da data de validação 
    TODO Analisar se a melhor estratégia é revalidar todo início de ano
    TODO Solicitar que seja reenviado o documento comprovando o vínculo
  */
  // public expiredAt() {
  //   this.props.validatedAt
  // }

  //! Provavelmente retirar esse código abaixo
  // static solicication(
  //   props: Optional<Solicitation, 'createdAt' | 'rule'>,
  //   id: string = randomUUID(),
  // ) {
  //   const solicication: Solicitation = {
  //     ...props,
  //     rule: 'STUDENT',
  //     createdAt: new Date(),
  //   }
  //   id

  //   return solicication
  // }

  static create(props: Optional<StudentProps, 'validatedAt'>, id?: string) {
    const student = new Student(
      { ...props, validatedAt: props.validatedAt ?? new Date() },
      id,
    )

    return student
  }
}
