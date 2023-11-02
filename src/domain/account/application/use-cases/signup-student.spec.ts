import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { SignUpStudentUseCase } from './signup-student'
import { faker } from '@faker-js/faker'
import { InMemorySolicitationsRepository } from 'test/repositories/in-memory-solicitations-repository'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'

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
    await sut.execute({
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric(6),
      phone: faker.phone.number(),
      dateOfBirth: new Date('2000-11-05'),
      responsibleName: faker.person.fullName(),
      responsiblePhone: faker.phone.number(),
      degreeOfKinship: faker.lorem.word(),
    })

    expect(solicitationsRepository.solicitations).toHaveLength(1)
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
      dateOfBirth: new Date('2000-11-05'),
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

    await expect(() => {
      return sut.execute({
        completeName: faker.person.fullName(),
        email,
        password: faker.string.alphanumeric(6),
        phone: faker.phone.number(),
        dateOfBirth: new Date('2000-11-05'),
        responsibleName: faker.person.fullName(),
        responsiblePhone: faker.phone.number(),
        degreeOfKinship: faker.lorem.word(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
