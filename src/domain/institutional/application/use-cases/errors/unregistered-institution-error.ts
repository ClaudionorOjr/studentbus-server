import { UseCaseError } from '@core/errors/use-case-error'

export class UnregisteredInstitutionError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Institution does not exist.')
  }
}
