import 'dotenv/config'
import { Type, Static } from '@sinclair/typebox'
import Ajv from 'ajv'

// Define the environment schema
const envSchema = Type.Object({
  PORT: Type.Integer({ default: 9000 }),
  DATABASE_URL: Type.String(),
  CLIENT_ENDPOINT: Type.String(),
  JWT_SECRET: Type.String(),
  REDIS_HOST: Type.String(),
  REDIS_PORT: Type.Integer(),
  REDIS: Type.String(),
  ACCESS_TOKEN_EXPIRES: Type.String(),
  REFRESH_TOKEN_EXPIRES: Type.String(),
  NODE_ENV: Type.Optional(Type.Union([Type.Literal('dev'), Type.Literal('test'), Type.Literal('production')])),
  POSTGRES_HOST_AUTH_METHOD: Type.Optional(Type.String()),

  // Payment-related environment variables
  MERCHANT_ID: Type.String(),
  ESEWA_SUCCESS_URL: Type.String(),
  ESEWA_FAILURE_URL: Type.String(),
  ESEWA_PAYMENT_URL: Type.String(),
  ESEWA_SECRET: Type.String()
})

// Type inference for `envSchema`
type Env = Static<typeof envSchema>

// Helper function to validate NODE_ENV
function getNodeEnv(env: string | undefined): 'dev' | 'test' | 'production' {
  if (env === 'dev' || env === 'test' || env === 'production') {
    return env
  }
  return 'dev' // Default to 'dev' if undefined or invalid
}

// Map `process.env` to `envData`, using the helper for `NODE_ENV`
const envData: Partial<Env> = {
  PORT: parseInt(process.env.PORT || '9000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  CLIENT_ENDPOINT: process.env.CLIENT_ENDPOINT || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS: process.env.REDIS || '',
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || '',
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || '',
  NODE_ENV: getNodeEnv(process.env.NODE_ENV),
  POSTGRES_HOST_AUTH_METHOD: process.env.POSTGRES_HOST_AUTH_METHOD || '',

  // Payment environment variables with defaults
  MERCHANT_ID: process.env.MERCHANT_ID || '',
  ESEWA_SUCCESS_URL: process.env.ESEWA_SUCCESS_URL || '',
  ESEWA_FAILURE_URL: process.env.ESEWA_FAILURE_URL || '',
  ESEWA_PAYMENT_URL: process.env.ESEWA_PAYMENT_URL || '',
  ESEWA_SECRET: process.env.ESEWA_SECRET || ''
}

// Create an AJV instance for validation
const ajv = new Ajv({ useDefaults: true })
const validate = ajv.compile(envSchema)

// Validate the mapped `envData`
const valid = validate(envData)

if (!valid) {
  console.error('❌ Invalid environment variables:', validate.errors)
  throw new Error('Invalid environment variables.')
}

// Export the validated environment variables
export const env = envData as Env
