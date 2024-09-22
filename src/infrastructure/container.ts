import { Container } from 'inversify'
import { PrismaAuthRepository } from '@/domain/repositories/auth-repository'
import { AuthController } from '../app/controllers/auth.controller'
import { AuthService } from '../app/services/auth.service'
import { TYPES } from '../types'
import { IAuthRepository } from '@/domain/interfaces/auth.interface'

const container = new Container()

container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope()

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope()

container.bind<IAuthRepository>(TYPES.IAuthRepository).to(PrismaAuthRepository).inSingletonScope()

export { container }
