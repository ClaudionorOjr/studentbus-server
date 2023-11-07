import { UseCaseError } from './use-case-error'

export class UnregisteredUserError extends Error implements UseCaseError {
  constructor() {
    super('User does not exist.')
  }
}
