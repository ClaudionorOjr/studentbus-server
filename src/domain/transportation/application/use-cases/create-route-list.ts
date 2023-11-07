import { UsersRepository } from '@account/application/repositories/users-repository'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { RouteList } from '../../enterprise/entities/route-list'
import { InstitutionsRepository } from '@institutional/application/repositories/institutions-repository'
import { Turn } from '@core/types/turn'

interface CreateRouteListUseCaseRequest {
  userId: string
  turn: Exclude<Turn, 'FULL TIME'>
  departureTime: string
  returnTime: string
  capacity: number
  institutions: string[]
}

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
  }: CreateRouteListUseCaseRequest) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('Driver does not exists!')
    }

    if (user.rule !== 'DRIVER') {
      throw new Error('Not allowed.')
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
      throw new Error(`${isUnregistered} institution is not registered.`)
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
  }
}
