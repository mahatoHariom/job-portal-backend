import { TYPES } from '@/types'
import { inject, injectable } from 'inversify'
import { AuthService } from '../services/auth-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserDetailInput } from '@/domain/schemas/user-schema'
import ApiError from '@/infrastructure/config/ApiError'
import { PrismaAuthRepository } from '@/domain/repositories/auth-repository'
import { UserServices } from '../services/user-service'

@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.IAuthRepository) private authRepository: PrismaAuthRepository,
    @inject(TYPES.UserServices) private userServices: UserServices
  ) {}

  async completeProfile(request: FastifyRequest<{ Body: CreateUserDetailInput }>, reply: FastifyReply) {
    const data = request.body
    console.log(1)

    const user = await this.authRepository.findById(request?.user?.id)
    console.log(2)
    if (!user) {
      throw new ApiError('Invalid credentials', 401)
    }
    console.log(3)

    await this.userServices.completeProfile(data, user.id)
    console.log(4)

    reply.status(200).send()
  }
}
