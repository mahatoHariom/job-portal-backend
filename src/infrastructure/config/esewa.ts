import { env } from '@/env'

export const esewaConfig = {
  merchantId: env.MERCHANT_ID,
  successUrl: env.ESEWA_SUCCESS_URL,
  failureUrl: env.ESEWA_FAILURE_URL,
  esewaPaymentUrl: env.ESEWA_PAYMENT_URL,
  secret: env.ESEWA_SECRET
}
