import { UsersRepository } from '@account/application/repositories/users-repository'
import { Driver } from '@account/enterprise/entities/driver'
import { RouteListsRepository } from '../repositories/route-lists-repository'
import { RouteList } from '../../enterprise/entities/route-list'

interface CreateRouteListUseCaseRequest {
  driverId: string
  turn: string
  departureTime: string
  returnTime: string
  capacity: number
  route: string[]
}

export class CreateRouteListUseCase {
  constructor(
    private usersRepository: UsersRepository<Driver>,
    private routeListsRepository: RouteListsRepository,
  ) {}

  async execute({
    driverId,
    departureTime,
    returnTime,
    turn,
    capacity,
    route,
  }: CreateRouteListUseCaseRequest): Promise<void> {
    const driver = await this.usersRepository.findById(driverId)

    if (!driver) {
      throw new Error('Driver does not exists!')
    }

    const routeList = RouteList.create({
      driverId,
      departureTime,
      returnTime,
      turn,
      capacity,
      route,
    })

    await this.routeListsRepository.create(routeList)
  }
}
