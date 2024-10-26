import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string(),
    confirmPassword: z.string().min(6) // Add confirmPassword field
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'] // The error will show on confirmPassword field
  })

export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string() // Update name to fullName
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

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
  },
  { $id: 'user' }
)
