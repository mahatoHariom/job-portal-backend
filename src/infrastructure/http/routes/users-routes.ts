import { FastifyInstance } from 'fastify'
import { $ref } from '@/domain/schemas/user-schema'
import { TYPES } from '@/types'
import { UserControllers } from '@/app/controllers/users-controller'

export default async function userRoutes(fastify: FastifyInstance) {
  const userControllers = fastify.container.get<UserControllers>(TYPES.UserControllers)

  fastify.post(
    '/complete-profile',
    {
      schema: {
        tags: ['User'],
        body: $ref('createUserDetailSchema'),
        response: {
          201: { type: 'null' }
        }
      },
      onRequest: fastify.authenticate
    },
    userControllers.completeProfile.bind(userControllers)
  )
}
