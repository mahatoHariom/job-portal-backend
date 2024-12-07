import { FastifyInstance } from 'fastify'
import authRoutes from './http/routes/auth-route'
import userRoutes from './http/routes/users-routes'
import contactRoutes from './http/routes/contact-route'
import subjectRoutes from './http/routes/subject-route'

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/api/v1/auth' })
  app.register(userRoutes, { prefix: '/api/v1/user' })
  app.register(contactRoutes, { prefix: '/api/v1/user' })
  app.register(subjectRoutes, { prefix: '/api/v1' })
  app.get('/health', async () => ({ status: 'ok' }))
}
