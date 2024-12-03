import { Prisma, Enrollment } from '@prisma/client'
import { injectable } from 'inversify'
import { PrismaService } from '@/app/services/prisma-service'
import { IEnrollmentRepository } from '../interfaces/enrollment-interface'

@injectable()
export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  private readonly prisma = PrismaService.getClient()

  async create(data: Prisma.EnrollmentCreateInput): Promise<Enrollment> {
    return this.prisma.enrollment.create({ data })
  }

  async findEnrollment(userId: string, subjectId: string): Promise<Enrollment | null> {
    return this.prisma.enrollment.findFirst({
      where: {
        userId,
        subjectId
      }
    })
  }

  async findByUserId(userId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { subject: true } // Include related subject data if needed
    })
  }
}
