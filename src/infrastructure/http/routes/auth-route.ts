import { FastifyInstance } from 'fastify'
import {
  createUserResponseSchema,
  createUserSchema,
  loginResponseSchema,
  loginSchema,
  refreshTokenResponseSchema,
  refreshTokenSchema
} from '@/domain/schemas/auth-schemas'
import { TYPES } from '@/types'
import { AuthController } from '@/app/controllers/auth-controller'
import { userResponseSchema } from '@/domain/schemas/user-schema'

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
    },
    authController.authenticate.bind(authController)
  ),
    fastify.post(
      '/refresh',
      {
        schema: {
          body: refreshTokenSchema,
          response: {
            200: refreshTokenResponseSchema
          }
        }
        // onRequest: fastify.authenticate
      },
      authController.refresh.bind(authController)
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
    fastify.post(
      '/logout',
      {
        schema: {
          response: {
            200: { type: 'null' }
          }
        },
        onRequest: fastify.authenticate
      },
      authController.logout.bind(authController)
    )

  fastify.get(
    '/profile',
    {
      schema: {
        response: {
          201: userResponseSchema
        }
      },
      onRequest: fastify.authenticate
    },

    authController.getProfileData.bind(authController)
  ),
    fastify.post('/payments/initiate', authController.initiateEsewaPayment.bind(authController))
}
