import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    // ? Dessa forma consigo identificar os erros de verificação de token e tratar no Error Handler global em 'app.ts'
    // const jwtVerifyError = new JwtVerifyError(error)
    // const jwtVerifyError = error as FastifyError

    reply.send(error)
  }
}
