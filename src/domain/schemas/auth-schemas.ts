import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { UserRole } from '@prisma/client'

export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string(),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  isVerified: z.boolean(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
    .email(),
  password: z.string().min(6)
})

export type LoginUserInput = z.infer<typeof loginSchema>

export const loginResponseSchema = z.object({
  accessToken: z.string()
})

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
  },
  { $id: 'user' }
)
