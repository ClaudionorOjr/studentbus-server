import { injectable } from 'tsyringe'
import { env } from '@infra/env'
import { Encrypter } from '@account/cryptography/encrypter'
import jwt from 'jsonwebtoken'

// ? O plugin @fastify/jwt fica associado a instância do `app` (app.ts), e seguindo essa lógica de criar uma classe responsável pela encriptação, acaba se tornando dependente da importação do `app` para conseguir gerar os tokens. Porém para os testes e2e, o TSyringe (utilizado para injeção automática das dependências) retorna erro pois tenta instânciar o JwtEncrypter mas é como se fosse utilizado outro objeto `app` diferente do contexto do teste. Para retirar essa dependência da instância do `app` dentro de JwtEncrypter, instalei também o jsonwebtoken para gerar os tokens sem precisar importar o `app` para gerar os tokens.
@injectable()
export class JwtEncrypter implements Encrypter {
  /**
   * Encrypts the given payload using JSON Web Token (JWT).
   *
   * @param {Record<string, unknown>} payload - The payload to be encrypted.
   * @return {Promise<string>} The encrypted payload as a string.
   */
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return jwt.sign(payload, Buffer.from(env.JWT_PRIVATE_KEY, 'base64'), {
      algorithm: 'RS256',
      expiresIn: '1d',
    })
  }
}
