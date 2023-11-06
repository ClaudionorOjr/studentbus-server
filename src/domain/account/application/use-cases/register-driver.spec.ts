import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterDriverUseCase } from './register-driver'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: RegisterDriverUseCase

describe('Register driver use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDriverUseCase(usersRepository, fakeHasher)
  })

  it('should be able to register a driver', async () => {
    await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(6),
      phone: faker.phone.number(),
    })

    expect(usersRepository.users).toHaveLength(1)
    expect(usersRepository.users[0].rule).toEqual('DRIVER')
  })

  it('should hash driver password upon register', async () => {
    await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
      phone: faker.phone.number(),
    })

    const driverPasswordHash = usersRepository.users[0].passwordHash
    const isPasswordCorrectlyHashed = await fakeHasher.compare(
      '123456',
      driverPasswordHash,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with email already registered', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create(makeUser({ email }))

    await expect(() => {
      return sut.execute({
        completeName: faker.person.fullName(),
        email,
        password: '123456',
        phone: faker.phone.number(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
