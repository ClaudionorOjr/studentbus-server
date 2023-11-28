import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'
import dayjs from 'dayjs'

export interface StudentProps {
  birthdate: Date
  validatedAt: Date
}

export class Student extends Entity<StudentProps> {
  /* GETTERS AND SETTERS */
  get birthdate() {
    return this.props.birthdate
  }

  set birthdate(birthdate: Date) {
    this.props.birthdate = birthdate
  }

  get validatedAt() {
    return this.props.validatedAt
  }

  /* METHODS */
  age() {
    return dayjs().diff(this.birthdate, 'year')
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
  //   props: Optional<Solicitation, 'createdAt' | 'role'>,
  //   id: string = randomUUID(),
  // ) {
  //   const solicication: Solicitation = {
  //     ...props,
  //     role: 'STUDENT',
  //     createdAt: new Date(),
  //   }
  //   id

  //   return solicication
  // }

  static create(props: Optional<StudentProps, 'validatedAt'>, id: string) {
    const student = new Student(
      { ...props, validatedAt: props.validatedAt ?? new Date() },
      id,
    )

    return student
  }
}
