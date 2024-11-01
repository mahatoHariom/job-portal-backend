import { FastifyInstance } from 'fastify'
import { TYPES } from '@/types'
import { UserControllers } from '@/app/controllers/users-controller'
import { CreateUserDetailInput, userDetailSchema } from '@/domain/schemas/user-schema'
import multer from 'fastify-multer'
import { upload } from '@/infrastructure/config/multer'
import { Type } from '@sinclair/typebox'

export default async function userRoutes(fastify: FastifyInstance) {
  const userControllers = fastify.container.get<UserControllers>(TYPES.UserControllers)

  fastify.post<{ Body: CreateUserDetailInput }>(
    '/complete-profile',
    {
      schema: {
        tags: ['User'],
        consumes: ['multipart/form-data'],
        body: Type.Object({
          ...userDetailSchema.properties,
          profilePic: Type.Optional(Type.String({ format: 'binary' }))
        }),
        response: {
          201: { type: 'null' }
        }
      },
      // onRequest: fastify.authenticate,
      preValidation: upload.single('profilePic')
    },
    userControllers.completeProfile.bind(userControllers)
  )
}
