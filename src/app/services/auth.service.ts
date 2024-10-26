import { injectable, inject } from 'inversify'
import { compare, hash } from 'bcryptjs'
import ApiError from '@/infrastructure/config/ApiError'
import { TYPES } from '@/types'
import { PrismaAuthRepository } from '@/domain/repositories/auth-repository'

interface AuthenticateRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  fullName: string
  password: string
  confirmPassword: string
}

@injectable()
export class AuthService {
  constructor(@inject(TYPES.IAuthRepository) private authRepository: PrismaAuthRepository) {}

  async authenticate({ email, password }: AuthenticateRequest) {
    const user = await this.authRepository.findByEmail(email)
    if (!user) {
      throw new ApiError('User does not exist', 401)
    }

    const doesPasswordMatch = await compare(password, user.password)
    if (!doesPasswordMatch) {
      throw new ApiError('Invalid credentials', 409)
    }

    return { user }
  }

  async register({ email, fullName, password, confirmPassword }: RegisterRequest) {
    if (password !== confirmPassword) {
      throw new ApiError('Password not matched', 403)
    }
    const hashedPassword = await hash(password, 12)
    const user = await this.authRepository.create({ email, fullName, password: hashedPassword })
    return user
  }
}
