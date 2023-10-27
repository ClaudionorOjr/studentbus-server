export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public eguals(valueObject: ValueObject<unknown>) {
    if (valueObject === null || valueObject === undefined) {
      return false
    }

    if (valueObject.props === undefined) {
      return false
    }

    return JSON.stringify(valueObject.props) === JSON.stringify(this.props)
  }
}

/*
 ? { name: 'jonh' } === { name: 'john' } Retorna false, pois o operador '===' não compara os dados de um objeto, ele compara se os dois objetos possuem a mesma posição em memória.
 * Por isso transformo o objeto para um tipo primitivo, como string, utilizando o JSON.stringify().
*/
