import { injectable, inject } from 'inversify'

import { TYPES } from '@/types'

import { CreateUserDetailInput } from '@/domain/schemas/user-schema'
import { PrismaUserRepository } from '@/domain/repositories/user-repository'
import { User } from '@prisma/client'

@injectable()
export class UserServices {
  constructor(@inject(TYPES.IUserRepository) private userRepository: PrismaUserRepository) {}

  async completeProfile(data: CreateUserDetailInput, userId: string): Promise<User> {
    return await this.userRepository.completeProfile(data, userId)
  }
}
