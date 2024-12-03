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
import { ContactController } from '@/app/controllers/contact-controller'
import { ContactService } from '@/app/services/contact-service'
import { IContactRepository } from '@/domain/interfaces/contact-interface'
import { PrismaContactRepository } from '@/domain/repositories/prtisma-contact-repository'
import { EnrollmentController } from '@/app/controllers/enrollment-controller'
import { EnrollmentService } from '@/app/services/enrollment-service'
import { IEnrollmentRepository } from '@/domain/interfaces/enrollment-interface'
import { PrismaEnrollmentRepository } from '@/domain/repositories/enrollment-repository'

const container = new Container()

container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope()

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope()

container.bind<IAuthRepository>(TYPES.IAuthRepository).to(PrismaAuthRepository).inSingletonScope()

container.bind<UserControllers>(TYPES.UserControllers).to(UserControllers).inSingletonScope()

container.bind<UserServices>(TYPES.UserServices).to(UserServices).inSingletonScope()

container.bind<IUserRepository>(TYPES.IUserRepository).to(PrismaUserRepository).inSingletonScope()

// COntact

container.bind<ContactController>(TYPES.ContactController).to(ContactController).inSingletonScope()

container.bind<ContactService>(TYPES.ContactService).to(ContactService).inSingletonScope()

container.bind<IContactRepository>(TYPES.IContactRepository).to(PrismaContactRepository).inSingletonScope()

// Enrollment

container.bind<EnrollmentController>(TYPES.EnrollmentController).to(EnrollmentController).inSingletonScope()

container.bind<EnrollmentService>(TYPES.EnrollmentService).to(EnrollmentService).inSingletonScope()

container
  .bind<PrismaEnrollmentRepository>(TYPES.PrismaEnrollmentRepository)
  .to(PrismaEnrollmentRepository)
  .inSingletonScope()

export { container }
