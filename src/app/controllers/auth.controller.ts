import { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'
import { generateJsonWebToken, generateRefreshToken } from '@/domain/utils/jwt'
import { LoginUserInput, CreateUserInput } from '@/domain/schemas/auth-schemas'
import { AuthService } from '../services/auth.service'
import { TYPES } from '@/types'

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  async authenticate(request: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) {
    const { email, password } = request.body
    const { user } = await this.authService.authenticate({ email, password })

    const refreshToken = generateRefreshToken(user)

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({ accessToken: generateJsonWebToken(user) })
  }

  async register(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const { email, fullName, password, confirmPassword } = request.body
    const user = await this.authService.register({ email, fullName, password, confirmPassword })
    return reply.status(201).send(user)
  }
}
