import { app } from 'src/app'
import { Encrypter } from '@account/cryptography/encrypter'

export class JwtEncrypter implements Encrypter {
  /**
   * Encrypts the given payload using JSON Web Token (JWT).
   *
   * @param {Record<string, unknown>} payload - The payload to be encrypted.
   * @return {Promise<string>} The encrypted payload as a string.
   */
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return app.jwt.sign(payload)
  }
}
