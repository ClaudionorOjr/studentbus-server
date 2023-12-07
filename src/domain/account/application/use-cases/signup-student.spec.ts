import 'reflect-metadata'
import { faker } from '@faker-js/faker'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { SignUpStudentUseCase } from './signup-student'
import { InMemorySolicitationsRepository } from 'test/repositories/in-memory-solicitations-repository'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let solicitationsRepository: InMemorySolicitationsRepository
let sut: SignUpStudentUseCase

describe('Signup student use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    solicitationsRepository = new InMemorySolicitationsRepository()
    sut = new SignUpStudentUseCase(
      usersRepository,
      fakeHasher,
      solicitationsRepository,
    )
  })

  it('should be able to signup a student', async () => {
    const result = await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(6),
      phone: faker.phone.number(),
      birthdate: new Date('2000-11-05'),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(solicitationsRepository.solicitations).toEqual([
      expect.objectContaining({ id: expect.any(String) }),
    ])
  })

  it('should hash student password upon signup', async () => {
    await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
      phone: faker.phone.number(),
      birthdate: new Date('2000-11-05'),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
    })

    const studentPasswordHash =
      solicitationsRepository.solicitations[0].passwordHash

    const isPasswordCorrectlyHashed = await fakeHasher.compare(
      '123456',
      studentPasswordHash,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with email already registered', async () => {
    const email = 'johndoe@example.com'

    await usersRepository.create(makeUser({ email }))

    const result = await sut.execute({
      completeName: faker.person.fullName(),
      email,
      password: faker.string.alphanumeric(6),
      phone: faker.phone.number(),
      birthdate: new Date('2000-11-05'),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
