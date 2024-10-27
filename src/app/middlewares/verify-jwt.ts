import ApiError from '@/infrastructure/config/ApiError'
import { validateAccessToken } from '@/domain/utils/jwt'
import { User } from '@prisma/client'
import { FastifyInstance, FastifyRequest } from 'fastify'

const setAuthenticateJWT = (server: FastifyInstance) => {
  server.decorate('authenticate', async (req: FastifyRequest) => {
    const token = req.headers.authorization

    console.log(token, 'SDf')
    const accessToken = token?.split(' ')[1]
    if (!token) {
      throw new ApiError('Token not found', 401)
    }
    const decoded = validateAccessToken(accessToken as string)
    if (!decoded) {
      throw new ApiError('Invalid or token expired', 401)
    }
    req.user = decoded as User
  })
}

export default setAuthenticateJWT
