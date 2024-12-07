import { Type } from '@sinclair/typebox'
import { userBaseSchema } from './user-schema'

// Base schema for a subject
export const subjectSchema = Type.Object({
  id: Type.String(),
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  users: Type.Array(
    Type.Object({
      userId: Type.String()
    })
  )
})

// Response schema for a single subject
export const subjectResponseSchema = subjectSchema

// Response schema for multiple subjects
export const subjectsResponseSchema = Type.Array(subjectSchema)

export type SubjectResponse = typeof subjectResponseSchema
