import { injectable } from 'inversify'
import { PrismaService } from '@/app/services/prisma-service'
import { IUserRepository } from '../interfaces/users-interface'
import { CreateUserDetailInput } from '../schemas/user-schema'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

@injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly prisma = PrismaService.getClient()

  async changePassword(userId: string, newPassword: string): Promise<User> {
    const hashedPassword = await hash(newPassword, 12)
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
  }

  async completeProfile(data: CreateUserDetailInput, userId: string): Promise<User> {
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

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      include: {
        userDetail: true
      },

      data: {
        isVerified: true
      }
    })

    return updatedUser
  }
}
