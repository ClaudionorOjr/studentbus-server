import { UseCaseError } from '@core/errors/use-case-error'

export class UserAlreadyOnListError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User ${identifier} is already on the list.`)
  }
}
