import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterAdminUseCase } from './register-admin'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: RegisterAdminUseCase

describe('Register admin use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdminUseCase(usersRepository, fakeHasher)
  })

  it('should be able to register an admin', async () => {
    const result = await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
      phone: faker.phone.number(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(usersRepository.users[0].rule).toEqual('ADMIN')
  })

  it('should hash driver password upon register', async () => {
    await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
      phone: faker.phone.number(),
    })

    const adminPasswordHashed = usersRepository.users[0].passwordHash

    const isPasswordCorrectlyHashed = await fakeHasher.compare(
      '123456',
      adminPasswordHashed,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with email already registered', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create(makeUser({ email }))

    const result = await sut.execute({
      completeName: faker.person.fullName(),
      email,
      password: '123456',
      phone: faker.phone.number(),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
