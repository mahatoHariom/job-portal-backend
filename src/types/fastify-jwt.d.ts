import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: { role: 'ADMIN' | 'MEMBER' }
    user: {
      role: 'ADMIN' | 'MEMBER'
      sub: string
    }
  }
}

// types.d.ts
import 'fastify'
import { Container } from 'inversify'

declare module 'fastify' {
  interface FastifyInstance {
    container: Container
  }
}
