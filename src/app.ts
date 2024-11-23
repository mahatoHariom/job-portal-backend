import 'reflect-metadata'
import fastify, { FastifyInstance } from 'fastify'

import { errorHandler } from './app/middlewares/errorHandler'
import { container } from './infrastructure/container'
import { loadEnvironment } from './infrastructure/environment'
import { registerPlugins } from './infrastructure/plugins'
import { registerMiddlewares } from './infrastructure/middlewares'
import { registerRoutes } from './infrastructure/routes'

/**
 * Creates and configures the Fastify application
 */
const createApp = async (): Promise<FastifyInstance> => {
  // Load environment variables
  loadEnvironment()

  // Initialize Fastify with logger
  const app = fastify({
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: true,
        useDefaults: true
      }
    }
  })

  try {
    // Register all plugins
    await registerPlugins(app)

    // Register all middlewares
    await registerMiddlewares(app)

    // Decorate app with DI container
    app.decorate('container', container)

    // Register all routes
    await registerRoutes(app)

    // Set global error handler
    app.setErrorHandler(errorHandler)

    return app
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

export default createApp
