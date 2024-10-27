import { injectable } from 'inversify'
import { PrismaService } from '@/app/services/prisma-service'
import { IUserRepository } from '../interfaces/users-interface'
import { CreateUserDetailInput } from '../schemas/user-schema'

@injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly prisma = PrismaService.getClient()

  async completeProfile(data: CreateUserDetailInput, userId: string): Promise<void> {
    await this.prisma.userDetail.create({
      data: {
        address: data.address,
        fatherName: data.fatherName,
        motherName: data.motherName,
        phoneNumber: data.phoneNumber,
        parentContact: data.parentContact,
        schoolCollegeName: data.schoolCollegeName,
        userId
      }
    })
    console.log('Completed', userId)
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isVerified: true
      }
    })
  }
}
