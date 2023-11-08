import { UseCaseError } from '@core/errors/use-case-error'

export class UnregisteredInstitutionError
  extends Error
  implements UseCaseError
{
  constructor(identifier?: string) {
    super(
      identifier
        ? `Institution ${identifier} does not exist.`
        : 'Institution does not exist.',
    )
  }
}
