import { CreateUserDetailInput } from '../schemas/user-schema'

export interface IUserRepository {
  completeProfile(data: CreateUserDetailInput, userId: string): Promise<void>
}
