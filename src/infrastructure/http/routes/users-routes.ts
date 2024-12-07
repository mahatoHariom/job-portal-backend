import { FastifyInstance } from 'fastify'
import { TYPES } from '@/types'
import { UserControllers } from '@/app/controllers/users-controller'
import multer from 'fastify-multer'
import { upload } from '@/infrastructure/config/multer'
import {
  CreateUserDetailInput,
  ChangePasswordInput,
  getEnrolledCourseSchema,
  enrollSubjectBody,
  userResponseSchema,
  changePasswordInputSchema
} from '@/domain/schemas/user-schema'
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
          ...userResponseSchema.properties,
          profilePic: Type.Optional(Type.String({ format: 'binary' }))
        }),
        response: {
          201: userResponseSchema
        }
      },
      onRequest: fastify.authenticate,
      preValidation: upload.single('profilePic')
    },
    userControllers.completeProfile.bind(userControllers)
  )

  fastify.post<{ Body: ChangePasswordInput }>(
    '/change-password',
    {
      schema: {
        tags: ['User'],
        body: changePasswordInputSchema,
        response: {
          201: { type: 'null' }
        }
      },
      onRequest: fastify.authenticate
    },
    userControllers.changePassword.bind(userControllers)
  )

  fastify.get(
    '/enrolled-courses/:userId',
    {
      schema: {
        tags: ['User'],
        params: getEnrolledCourseSchema,
        response: {
          200: Type.Object({
            courses: Type.Array(
              Type.Object({
                id: Type.String(),
                name: Type.String(),
                description: Type.Optional(Type.String()),
                createdAt: Type.String({ format: 'date-time' })
              })
            ),
            total: Type.Number(),
            page: Type.Number(),
            limit: Type.Number(),
            totalPages: Type.Number(),
            hasPreviousPage: Type.Boolean(),
            hasNextPage: Type.Boolean()
          })
        }
      },
      onRequest: fastify.authenticate
    },
    userControllers.getUserCourses.bind(userControllers)
  )

  fastify.post(
    '/enroll-subject',
    {
      schema: {
        tags: ['User'],
        body: enrollSubjectBody,
        response: {
          201: { type: 'null' }
        }
      },
      onRequest: fastify.authenticate
    },
    userControllers.enrollInSubject.bind(userControllers)
  )
}
