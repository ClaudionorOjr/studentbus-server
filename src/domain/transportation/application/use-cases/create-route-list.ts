import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { RouteList } from '../../enterprise/entities/route-list'
import { InstitutionsRepository } from '@institutional/application/repositories/institutions-repository'
import { Turn } from '@core/types/turn'
import { Either, failure, success } from '@core/either'
import { UnregisteredUserError } from '@core/errors/unregistered-user-error'
import { UnregisteredInstitutionError } from '@institutional/application/use-cases/errors/unregistered-institution-error'
import { NotAllowedError } from '@core/errors/not-allowerd-error'

interface CreateRouteListUseCaseRequest {
  userId: string
  turn: Exclude<Turn, 'FULL TIME'>
  departureTime: string
  returnTime: string
  capacity: number
  institutions: string[]
}

type CreateRouteListUseCaseResponse = Either<
  UnregisteredUserError | UnregisteredInstitutionError | NotAllowedError,
  object
>

export class CreateRouteListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private institutiosRepository: InstitutionsRepository,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({
    userId,
    departureTime,
    returnTime,
    turn,
    capacity,
    institutions,
  }: CreateRouteListUseCaseRequest): Promise<CreateRouteListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      // throw new Error('Driver does not exists!')
      return failure(new UnregisteredUserError())
    }

    if (user.rule !== 'DRIVER') {
      // throw new Error('Not allowed.')
      return failure(new NotAllowedError())
    }

    const registeredInstitutions = (
      await this.institutiosRepository.list({
        page: 1,
      })
    ).map((institution) => institution.name)

    /*
     * Posso trocar o find() por some() para retornar um booleano
     * Ou trocar o find() por every() e retirar a negação '!' do registeredInstitutions
     */
    const isUnregistered = institutions.find(
      (institution) => !registeredInstitutions.includes(institution),
    )

    if (isUnregistered) {
      // throw new Error(`${isUnregistered} institution is not registered.`)
      return failure(new UnregisteredInstitutionError(isUnregistered))
    }

    const routeList = RouteList.create({
      userId,
      departureTime,
      returnTime,
      turn,
      capacity,
      institutions,
    })

    await this.routeListsRepository.create(routeList)

    return success({})
  }
}
