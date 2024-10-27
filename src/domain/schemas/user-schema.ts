import { Type } from '@sinclair/typebox'
// import { FastifyInstance } from 'fastify'

// Define the individual user detail schema
export const userDetailSchema = Type.Object({
  phoneNumber: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  motherName: Type.Optional(Type.String()),
  fatherName: Type.Optional(Type.String()),
  parentContact: Type.Optional(Type.String()),
  schoolCollegeName: Type.Optional(Type.String())
})

// Create an extended schema for response that includes `id` and `userId`
export const userDetailResponseSchema = Type.Intersect([
  userDetailSchema,
  Type.Object({
    id: Type.String(),
    userId: Type.String()
  })
])

// You could define types for your schemas if needed using TypeBox's static inference
export type CreateUserDetailInput = typeof userDetailSchema
export type UserDetailResponse = typeof userDetailResponseSchema
