import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

export const userDetailSchema = z.object({
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  parentContact: z.string().optional(),
  schoolCollegeName: z.string().optional()
})

export const createUserDetailSchema = z.object({
  ...userDetailSchema.shape
})

export const userDetailResponseSchema = userDetailSchema.extend({
  id: z.string(),
  userId: z.string()
})

// export type UserDetail = z.infer<typeof userDetailSchema>
export type CreateUserDetailInput = z.infer<typeof createUserDetailSchema>
export type UserDetailResponse = z.infer<typeof userDetailResponseSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserDetailSchema,
    userDetailResponseSchema
  },
  { $id: 'UserSchema' }
)
