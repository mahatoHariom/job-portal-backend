import { FastifyInstance } from 'fastify'
import { $ref } from '@/domain/schemas/auth-schemas'
import { TYPES } from '@/types'
import { AuthController } from '@/app/controllers/auth-controller'

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = fastify.container.get<AuthController>(TYPES.AuthController)

  fastify.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          201: $ref('loginResponseSchema')
        }
      }
      // onRequest: fastify.authenticate
    },
    authController.authenticate.bind(authController)
  )
  fastify.post(
    '/register',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema')
        }
      }
    },

    authController.register.bind(authController)
  )
}
