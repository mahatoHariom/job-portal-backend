import { injectable, inject } from 'inversify'
import { TYPES } from '@/types'
import { PrismaEnrollmentRepository } from '@/domain/repositories/enrollment-repository'
import { Prisma, Enrollment } from '@prisma/client'

interface EnrollInput {
  userId: string
  subjectId: string
}

@injectable()
export class EnrollmentService {
  constructor(@inject(TYPES.PrismaEnrollmentRepository) private enrollmentRepository: PrismaEnrollmentRepository) {}

  async enroll({ userId, subjectId }: EnrollInput): Promise<Enrollment> {
    const enrollmentExists = await this.enrollmentRepository.findEnrollment(userId, subjectId)
    if (enrollmentExists) {
      throw new Error('User already enrolled in this subject')
    }

    return this.enrollmentRepository.create({
      user: { connect: { id: userId } },
      subject: { connect: { id: subjectId } }
    })
  }

  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByUserId(userId)
  }
}
