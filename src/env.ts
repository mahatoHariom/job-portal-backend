import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(9000),
  CLIENT_ENDPOINT: z.string(),
  REFRESH_TOKEN_EXPIRES: z.string(),
  ACCESS_TOKEN_EXPIRES: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables.', _env.error.format())
  console.log(JSON.stringify(_env.error, null, 2))
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
