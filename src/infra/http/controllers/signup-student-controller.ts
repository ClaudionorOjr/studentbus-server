import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSignupStudentUseCase } from '@infra/database/prisma/factories/make-signup-student-use-case'
import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists-error'
import { z } from 'zod'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export async function signUpStudent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const signUpStudentBodySchema = z.object({
    completeName: z.string(),
    email: z.string().email(),
    password: z.coerce.string().min(6),
    phone: z.string(),
    birthdate: z
      .string()
      .transform((date) => dayjs(date, 'DD/MM/YYYY').toDate()),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    degreeOfKinship: z.string().optional(),
  })

  const {
    completeName,
    email,
    password,
    phone,
    birthdate,
    degreeOfKinship,
    responsibleName,
    responsiblePhone,
  } = signUpStudentBodySchema.parse(request.body)

  try {
    const signUpStudentUseCase = makeSignupStudentUseCase()

    const result = await signUpStudentUseCase.execute({
      completeName,
      email,
      password,
      phone,
      birthdate,
      degreeOfKinship,
      responsibleName,
      responsiblePhone,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
