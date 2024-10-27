import { Container } from 'inversify'
import { PrismaAuthRepository } from '@/domain/repositories/auth-repository'
import { AuthController } from '../app/controllers/auth-controller'
import { AuthService } from '../app/services/auth-service'
import { TYPES } from '../types'
import { IAuthRepository } from '@/domain/interfaces/auth-interface'
import { UserControllers } from '@/app/controllers/users-controller'
import { UserServices } from '@/app/services/user-service'
import { IUserRepository } from '@/domain/interfaces/users-interface'
import { PrismaUserRepository } from '@/domain/repositories/user-repository'

const container = new Container()

container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope()

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope()

container.bind<IAuthRepository>(TYPES.IAuthRepository).to(PrismaAuthRepository).inSingletonScope()

container.bind<UserControllers>(TYPES.UserControllers).to(UserControllers).inSingletonScope()

container.bind<UserServices>(TYPES.UserServices).to(UserServices).inSingletonScope()

container.bind<IUserRepository>(TYPES.IUserRepository).to(PrismaUserRepository).inSingletonScope()

export { container }
