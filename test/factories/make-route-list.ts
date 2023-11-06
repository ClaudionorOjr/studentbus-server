import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { RouteList } from 'src/domain/transportation/enterprise/entities/route-list'

export function makeRouteList(override: Partial<RouteList> = {}, id?: string) {
  const routeList = RouteList.create(
    {
      userId: randomUUID(),
      departureTime: '17:30',
      returnTime: '22:00',
      turn: 'MORNING',
      capacity: faker.number.int({ max: 50 }),
      institutions: [faker.company.name()],
      ...override,
    },
    id,
  )

  return routeList
}
