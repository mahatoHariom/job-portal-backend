import { FastifyInstance } from 'fastify'
import authRoutes from './http/routes/auth-route'
import userRoutes from './http/routes/users-routes'
import contactRoutes from './http/routes/contact-route'

export async function registerRoutes(app: FastifyInstance) {
  // API routes
  app.register(authRoutes, { prefix: '/api/v1/auth' })
  app.register(userRoutes, { prefix: '/api/v1/user' })
  app.register(contactRoutes, { prefix: '/api/v1/user' })

  // Health check route
  app.get('/health', async () => ({ status: 'ok' }))
}
