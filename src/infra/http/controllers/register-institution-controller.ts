import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterInstitutionUseCase } from '@institutional/application/use-cases/register-institution'
import { InstitutionAlreadyExistsError } from '@institutional/application/use-cases/errors/institution-already-exists-error'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function registerInstitution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerInstitutionBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerInstitutionBodySchema.parse(request.body)

  try {
    const registerInstitutionUseCase = container.resolve(
      RegisterInstitutionUseCase,
    )

    const result = await registerInstitutionUseCase.execute({
      name,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof InstitutionAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
