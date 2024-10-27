import { FastifyInstance } from 'fastify'
// import { $ref } from '@/domain/schemas/user-schema'
import { TYPES } from '@/types'
import { UserControllers } from '@/app/controllers/users-controller'
import { userDetailSchema } from '@/domain/schemas/user-schema'

export default async function userRoutes(fastify: FastifyInstance) {
  const userControllers = fastify.container.get<UserControllers>(TYPES.UserControllers)

  fastify.post(
    '/complete-profile',
    {
      schema: {
        tags: ['User'],
        body: userDetailSchema,
        response: {
          201: { type: 'null' }
        }
      },
      onRequest: fastify.authenticate
    },
    userControllers.completeProfile.bind(userControllers)
  )
}
