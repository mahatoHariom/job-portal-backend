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
import { SubjectController } from '@/app/controllers/subject-controller'
import { SubjectService } from '@/app/services/subject-service'
import { ISubjectRepository } from '@/domain/interfaces/subject.interface'
import { PrismaSubjectRepository } from '@/domain/repositories/subject-repository'

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

// Subject

container.bind<SubjectController>(TYPES.SubjectController).to(SubjectController).inSingletonScope()

container.bind<SubjectService>(TYPES.SubjectService).to(SubjectService).inSingletonScope()

container.bind<ISubjectRepository>(TYPES.ISubjectRepository).to(PrismaSubjectRepository).inSingletonScope()

export { container }
