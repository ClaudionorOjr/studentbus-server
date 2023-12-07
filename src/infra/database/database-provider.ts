/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DatabaseProvider {
  onModuleInit(): any

  onModuleDestroy(): any
}
