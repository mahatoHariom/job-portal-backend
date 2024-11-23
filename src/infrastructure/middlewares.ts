import { FastifyInstance } from 'fastify'
import setAuthenticateJWT from '../app/middlewares/verify-jwt'

export async function registerMiddlewares(app: FastifyInstance) {
  // Global error hook
  app.addHook('onError', (request, reply, error, done) => {
    app.log.error(error)
    done()
  })

  // JWT authentication
  setAuthenticateJWT(app)
}
