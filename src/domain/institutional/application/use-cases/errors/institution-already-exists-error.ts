import { UseCaseError } from '@core/errors/use-case-error'

export class InstitutionAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Institution already exists!')
  }
}
