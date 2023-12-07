import { injectable } from 'tsyringe'
import { Hasher } from '@account/cryptography/hasher'
import { compare, hash } from 'bcryptjs'

@injectable()
export class BcryptHasher implements Hasher {
  readonly HASH_SALT_LENGTH = 8

  /**
   * Generates a hash of the given plain text string.
   *
   * @param {string} plain - The plain text string to be hashed.
   * @return {Promise<string>} A promise that resolves to the hashed string.
   */
  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  /**
   * Compares a plain text string with a hashed string and returns a promise
   * that resolves to a boolean indicating whether they match.
   *
   * @param {string} plain - The plain text string to compare.
   * @param {string} hash - The hashed string to compare against.
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating
   * whether the plain text and hashed string match.
   */
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
