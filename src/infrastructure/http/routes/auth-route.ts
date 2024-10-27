import { FastifyInstance } from 'fastify'
import {
  createUserResponseSchema,
  createUserSchema,
  loginResponseSchema,
  loginSchema
} from '@/domain/schemas/auth-schemas'
import { TYPES } from '@/types'
import { AuthController } from '@/app/controllers/auth-controller'

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = fastify.container.get<AuthController>(TYPES.AuthController)

  fastify.post(
    '/login',
    {
      schema: {
        body: loginSchema,
        response: {
          201: loginResponseSchema
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
        body: createUserSchema,
        response: {
          201: createUserResponseSchema
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
            201: createUserResponseSchema
          }
        },
        onRequest: fastify.authenticate
      },

      authController.getProfileData.bind(authController)
    ),
    fastify.post('/payments/initiate', authController.initiateEsewaPayment.bind(authController))
}
