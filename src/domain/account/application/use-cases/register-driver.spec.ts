import 'reflect-metadata'
import { RegisterDriverUseCase } from './register-driver'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { faker } from '@faker-js/faker'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

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
    const result = await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(6),
      phone: faker.phone.number(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(usersRepository.users[0].role).toEqual('DRIVER')
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
