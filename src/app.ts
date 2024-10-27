import 'reflect-metadata'
import fastify, { FastifyInstance } from 'fastify'
import loggerConfig from './infrastructure/config/logger'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie'
import cors from '@fastify/cors'
import fhelmet from '@fastify/helmet'
import { env } from './env'
import fSwagger from '@fastify/swagger'
import fSwaggerUi from '@fastify/swagger-ui'
import fRateLimit from '@fastify/rate-limit'
import { authSchemas } from './domain/schemas/auth-schemas'
import { productSchemas } from './domain/schemas/product-schema'
import { errorHandler } from './app/middlewares/errorHandler'
import setAuthenticateJWT from './app/middlewares/verify-jwt'
import { container } from './infrastructure/container'
import authRoutes from './infrastructure/http/routes/auth-route'
import { swaggerUiOptions } from './infrastructure/config/swagger'
import userRoutes from './infrastructure/http/routes/users-routes'
import { userSchemas } from './domain/schemas/user-schema'

const createApp = async () => {
  const app: FastifyInstance = fastify({ logger: loggerConfig })

  app.addHook('onError', (request, reply, error, done) => {
    done()
  })

  app.register(cors, {
    credentials: true,
    origin: [env.CLIENT_ENDPOINT]
  })

  app.register(fhelmet, { contentSecurityPolicy: false })

  app.register(fSwagger, {
    openapi: {
      info: {
        title: 'Fastify API',
        description: 'PostgreSQL, Prisma, Fastify, and Swagger REST API',
        version: '1.0.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      servers: [{ url: 'http://localhost:9000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  })
  await app.register(fSwaggerUi, swaggerUiOptions)

  app.register(fRateLimit, {
    max: 100,
    timeWindow: '1 minute'
  })

  app.register(fastifyCookie, {
    secret: env.JWT_SECRET,
    hook: 'preHandler',
    parseOptions: {}
  } as FastifyCookieOptions)

  app.register(fastifyJwt, { secret: env.JWT_SECRET })

  for (const schema of [...authSchemas, ...productSchemas, ...userSchemas]) {
    app.addSchema(schema)
  }

  setAuthenticateJWT(app)

  app.decorate('container', container)

  app.register(authRoutes, { prefix: '/api/v1/auth' })
  app.register(userRoutes, { prefix: '/api/v1/user' })
  app.setErrorHandler(errorHandler)

  return app
}

export default createApp
