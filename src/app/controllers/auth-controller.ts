import { FastifyReply, FastifyRequest } from 'fastify'
import { inject, injectable } from 'inversify'
import { generateJsonWebToken, generateRefreshToken } from '@/domain/utils/jwt'
import { LoginUserInput, CreateUserInput } from '@/domain/schemas/auth-schemas'
import { AuthService } from '../services/auth-service'
import { TYPES } from '@/types'
import ApiError from '@/infrastructure/config/ApiError'
import axios from 'axios'
import { safeStringify } from '@/domain/utils/safe-json'
import { generateHmacSha256Hash } from '@/domain/utils/create-payment-hash'
import { esewaConfig } from '@/infrastructure/config/esewa'
import { PaymentData } from '@/types/payment'
import { Messages, StatusCode } from '@/domain/constants/messages'

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  async authenticate(request: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) {
    const { email, password } = request.body
    const user = await this.authService.authenticate({ email, password })

    if (!user) {
      throw new ApiError(Messages.INVALID_CREDENTIAL, StatusCode.Unauthorized)
    }

    const refreshToken = await generateRefreshToken(user)
    const accessToken = await generateJsonWebToken(user)

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({ accessToken, refreshToken, user })
  }

  async register(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const { email, fullName, password, confirmPassword } = request.body
    const user = await this.authService.register({ email, fullName, password, confirmPassword })
    return reply.status(201).send(user)
  }
  async getProfileData(request: FastifyRequest, reply: FastifyReply) {
    console.log('getProfileData', request)
    const user = await this.authService.getProfileData(request?.user?.id)
    if (!user) {
      throw new ApiError(Messages.USER_NOT_FOUND, StatusCode.NotFound)
    }
    return reply.status(201).send(user)
  }

  async initiateEsewaPayment(request: FastifyRequest, reply: FastifyReply) {
    const { amount, productId } = request.body as { amount: number; productId: string }

    if (!amount || amount <= 0) {
      throw new ApiError(Messages.AMOUNT_MUST_BE_GREATER, StatusCode.BadRequest)
    }

    console.log(esewaConfig, 'config')
    let paymentData: PaymentData = {
      amount,
      failure_url: esewaConfig.failureUrl as string,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: esewaConfig.merchantId as string,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: esewaConfig.successUrl as string,
      tax_amount: '0',
      total_amount: amount,
      transaction_uuid: productId
    }
    const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`
    const signature = await generateHmacSha256Hash(data, esewaConfig.secret)
    paymentData = { ...paymentData, signature }

    try {
      const payment = await axios.post(esewaConfig.esewaPaymentUrl as string, null, {
        params: paymentData
      })
      const reqPayment = JSON.parse(safeStringify(payment))
      if (reqPayment.status === 200) {
        return reply.send({
          url: reqPayment.request.res.responseUrl
        })
      }
    } catch (error) {
      console.log(error)
      throw new ApiError(Messages.PAYMENT_FAILED, StatusCode.InternalServerError)
      // return reply.status(500).send({ error: 'Payment initiation failed' })
    }

    return reply.send({ esewaUrl: paymentData.success_url })
  }
}
