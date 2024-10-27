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
  ),
    fastify.get(
      '/profile',
      {
        schema: {
          response: {
            201: $ref('createUserResponseSchema')
          }
        },
        onRequest: fastify.authenticate
      },

      authController.getProfileData.bind(authController)
    ),
    fastify.post('/payments/initiate', authController.initiateEsewaPayment.bind(authController))
}
