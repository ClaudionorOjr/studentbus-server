import { UsersRepository } from '@account/application/repositories/users-repository'
import { User } from '@core/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(user: User): Promise<void> {
    this.users.push(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex((item) => item.id === user.id)

    this.users[userIndex] = user
  }
}
