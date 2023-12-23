import { Entity } from '@core/entities/entity'
import { UserProps } from '@core/entities/user'
import { Optional } from '@core/types/optional'
import dayjs from 'dayjs'

export interface StudentProps extends UserProps {
  birthdate: Date
  validatedAt: Date
}

// TODO: Alterar a lógica da classe `Student` para extender `User`
export class Student extends Entity<StudentProps> {
  /* GETTERS AND SETTERS */
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

  get birthdate() {
    return this.props.birthdate
  }

  set birthdate(birthdate: Date) {
    this.props.birthdate = birthdate
    this.touch()
  }

  get validatedAt() {
    return this.props.validatedAt
  }

  /* METHODS */
  protected touch() {
    this.props.updatedAt = new Date()
  }

  age() {
    return dayjs().diff(this.birthdate, 'year')
  }

  // ! Rever a funcionalidade de validação do cadastro
  // public validate() {
  //   this.props.validatedAt = new Date()
  // }

  /* 
    TODO: Mecanismo de expiração, no ano seguinte ao ano da data de validação 
    TODO: Analisar se a melhor estratégia é revalidar todo início de ano
    TODO: Solicitar que seja reenviado o documento comprovando o vínculo
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

  static create(
    props: Optional<StudentProps, 'role' | 'validatedAt' | 'createdAt'>,
    id?: string,
  ) {
    const student = new Student(
      {
        ...props,
        role: 'STUDENT',
        validatedAt: props.validatedAt ?? new Date(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return student
  }
}
