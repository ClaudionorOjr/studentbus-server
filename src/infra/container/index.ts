import { container } from 'tsyringe'

import { Hasher } from '@account/cryptography/hasher'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

import { Encrypter } from '@account/cryptography/encrypter'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'

import { UsersRepository } from '@account/application/repositories/users-repository'
import { PrismaUsersRepository } from '@infra/database/prisma/repositories/prisma-users-repository'

import { StudentsRepository } from '@account/application/repositories/students-repository'
import { PrismaStudentsRepository } from '@infra/database/prisma/repositories/prisma-students-repository'

import { SolicitationsRepository } from '@account/application/repositories/solicitations-repository'
import { PrismaSolicitatitonsRepository } from '@infra/database/prisma/repositories/prisma-solicitations-repository'

import { ResponsiblesRepository } from '@account/application/repositories/responsibles-repository'
import { PrismaResponsiblesRepository } from '@infra/database/prisma/repositories/prisma-responsibles-repository'

import { DatabaseProvider } from '../database/database-provider'
import { PrismaService } from '@infra/database/prisma'

import { InstitutionsRepository } from '@institutional/application/repositories/institutions-repository'
import { PrismaInstitutionsRepository } from '@infra/database/prisma/repositories/prisma-institutions-repository'

container.registerSingleton<DatabaseProvider>('Prisma', PrismaService)

container.registerSingleton<Hasher>('Hasher', BcryptHasher)

container.registerSingleton<Encrypter>('Encrypter', JwtEncrypter)

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  PrismaUsersRepository,
)

container.registerSingleton<StudentsRepository>(
  'StudentsRepository',
  PrismaStudentsRepository,
)

container.registerSingleton<SolicitationsRepository>(
  'SolicitationsRepository',
  PrismaSolicitatitonsRepository,
)

container.registerSingleton<ResponsiblesRepository>(
  'ResponsiblesRepository',
  PrismaResponsiblesRepository,
)

container.registerSingleton<InstitutionsRepository>(
  'InstitutionsRepository',
  PrismaInstitutionsRepository,
)
