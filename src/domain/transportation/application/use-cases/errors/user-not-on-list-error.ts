import { UseCaseError } from '@core/errors/use-case-error'

export class UserNotOnListError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super(
      identifier
        ? `User ${identifier} is not on the list.`
        : 'User is not on the list.',
    )
  }
}
