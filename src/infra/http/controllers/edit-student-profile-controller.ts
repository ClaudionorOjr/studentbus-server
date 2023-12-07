import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { EditStudentProfileUseCase } from '@account/application/use-cases/edit-student-profile'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'

import { z } from 'zod'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export async function editStudentProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editStudentProfileBodySchema = z.object({
    completeName: z.string().optional(),
    phone: z.string().optional(),
    birthdate: z
      .string()
      .transform((date) => dayjs(date, 'DD/MM/YYYY').toDate())
      .optional(),
    responsibleName: z.string().optional(),
    responsiblePhone: z.string().optional(),
    degreeOfKinship: z.string().optional(),
  })

  const {
    completeName,
    phone,
    birthdate,
    responsibleName,
    responsiblePhone,
    degreeOfKinship,
  } = editStudentProfileBodySchema.parse(request.body)

  const userId = request.user.sub

  try {
    const editStudentProfileUseCase = container.resolve(
      EditStudentProfileUseCase,
    )

    const result = await editStudentProfileUseCase.execute({
      userId,
      completeName,
      phone,
      birthdate,
      responsibleName,
      responsiblePhone,
      degreeOfKinship,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof UnregisteredUserError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
