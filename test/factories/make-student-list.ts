import { randomUUID } from 'node:crypto'
import { StudentOnList } from 'src/domain/transportation/enterprise/entities/student-on-list'

export function makeStudentList(
  override: Partial<StudentOnList> = {},
  id?: string,
) {
  const studentOnList = StudentOnList.create(
    {
      userId: randomUUID(),
      listId: randomUUID(),
      ...override,
    },
    id,
  )

  return studentOnList
}
