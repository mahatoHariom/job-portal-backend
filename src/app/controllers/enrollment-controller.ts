import { injectable, inject } from 'inversify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { TYPES } from '@/types'
import { EnrollmentService } from '../services/enrollment-service'
import ApiError from '@/infrastructure/config/ApiError'
import { Messages, StatusCode } from '@/domain/constants/messages'

interface EnrollRequest {
  subjectId: string
}

@injectable()
export class EnrollmentController {
  constructor(@inject(TYPES.EnrollmentService) private enrollmentService: EnrollmentService) {}

  async enrollUser(request: FastifyRequest<{ Body: EnrollRequest }>, reply: FastifyReply) {
    const { subjectId } = request.body
    const userId = request.user?.id

    if (!userId) {
      throw new ApiError(Messages.INVALID_CREDENTIAL, StatusCode.Unauthorized)
    }

    const enrollment = await this.enrollmentService.enroll({ userId, subjectId })

    return reply.status(201).send({ message: 'Enrollment successful', enrollment })
  }

  async getUserEnrollments(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.id

    if (!userId) {
      throw new ApiError(Messages.INVALID_CREDENTIAL, StatusCode.Unauthorized)
    }

    const enrollments = await this.enrollmentService.getEnrollmentsByUser(userId)

    return reply.status(200).send({ enrollments })
  }
}
