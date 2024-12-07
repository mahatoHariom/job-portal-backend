import { TYPES } from '@/types'
import { inject, injectable } from 'inversify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ChangePasswordInput, CreateUserDetailInput, EnrollSubjectInput } from '@/domain/schemas/user-schema'
import ApiError from '@/infrastructure/config/ApiError'
import { PrismaAuthRepository } from '@/domain/repositories/auth-repository'
import { UserServices } from '../services/user-service'
import { Messages, StatusCode } from '@/domain/constants/messages'
import { generateJsonWebToken, generateRefreshToken } from '@/domain/utils/jwt'
import { SubjectService } from '../services/subject-service'

@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: PrismaAuthRepository,
    @inject(TYPES.UserServices) private userServices: UserServices,
    @inject(TYPES.SubjectService) private subjectService: SubjectService
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

    return reply.status(200).send({
      accessToken,
      refreshToken,
      updatedUser
    })
  }

  async enrollInSubject(request: FastifyRequest<{ Body: EnrollSubjectInput }>, reply: FastifyReply) {
    const { userId, subjectId } = request.body

    const subject = await this.subjectService.getSubjectById(subjectId)
    if (!subject) {
      return reply.status(400).send({ message: 'Subject not found' })
    }

    const user = await this.authRepository.findById(userId)
    if (!user) {
      return reply.status(400).send({ message: 'User not found' })
    }

    const existingEnrollment = await this.subjectService.checkEnrollment(userId, subjectId)
    if (existingEnrollment) {
      return reply.status(400).send({ message: 'User already enrolled in this subject' })
    }

    await this.subjectService.enrollUserInSubject(userId, subjectId)

    return reply.status(200).send()
  }

  async changePassword(request: FastifyRequest<{ Body: ChangePasswordInput }>, reply: FastifyReply) {
    const { password, confirmPassword } = request.body

    if (password !== confirmPassword) {
      throw new ApiError(Messages.PASSWORD_NOT_MATCHED, StatusCode.Forbidden)
    }

    await this.userServices.changePassword(request.user?.id, password)

    return reply.status(200).send()
  }

  async getUserCourses(
    request: FastifyRequest<{
      Params: { userId: string }
      Querystring: { page?: number; limit?: number; search?: string }
    }>,
    reply: FastifyReply
  ) {
    const { userId } = request.params
    const { page = 1, limit = 10, search } = request.query

    const {
      subjects,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
      hasPreviousPage,
      hasNextPage
    } = await this.subjectService.getUserSubjects(userId, page, limit, search)

    return reply.status(200).send({
      courses: subjects,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
      hasPreviousPage,
      hasNextPage
    })
  }
}
