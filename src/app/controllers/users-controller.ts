import { TYPES } from '@/types'
import { inject, injectable } from 'inversify'
import { AuthService } from '../services/auth-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserDetailInput } from '@/domain/schemas/user-schema'
import ApiError from '@/infrastructure/config/ApiError'
import { PrismaAuthRepository } from '@/domain/repositories/auth-repository'
import { UserServices } from '../services/user-service'
import { Messages, StatusCode } from '@/domain/constants/messages'
import { generateJsonWebToken, generateRefreshToken } from '@/domain/utils/jwt'
import { User } from '@prisma/client'
@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.IAuthRepository) private authRepository: PrismaAuthRepository,
    @inject(TYPES.UserServices) private userServices: UserServices
  ) {}

  async completeProfile(request: FastifyRequest<{ Body: CreateUserDetailInput }>, reply: FastifyReply) {
    const data = request.body
    const user = await this.authRepository.findById(request.user?.id)

    if (!user) {
      throw new ApiError(Messages.INVALID_CREDENTIAL, StatusCode.Unauthorized)
    }

    const updatedUser = await this.userServices.completeProfile(data, user.id)

    const refreshToken = await generateRefreshToken(updatedUser)
    const accessToken = await generateJsonWebToken(updatedUser)

    return reply.status(200).send({ accessToken, refreshToken, updatedUser })
  }
}
