import { Static, Type } from '@sinclair/typebox'

// Schema for creating an enrollment
export const enrollmentCreateSchema = Type.Object({
  userId: Type.String({ minLength: 1 }), // ID of the user enrolling
  subjectId: Type.String({ minLength: 1 }) // ID of the subject to enroll
})

// Response schema for an enrollment
export const enrollmentResponseSchema = Type.Object({
  message: Type.String(), // Adding message to the response
  enrollment: Type.Intersect([
    enrollmentCreateSchema,
    Type.Object({
      id: Type.String(), // Unique ID for the enrollment
      enrollmentDate: Type.String({ format: 'date-time' }) // Timestamp for when the enrollment was created
    })
  ])
})

// Detailed response schema for an enrollment (with user and subject details)
export const detailedEnrollmentResponseSchema = Type.Object({
  id: Type.String(),
  enrollmentDate: Type.String({ format: 'date-time' }),
  user: Type.Object({
    id: Type.String(),
    fullName: Type.String()
  }),
  subject: Type.Object({
    id: Type.String(),
    name: Type.String()
  })
})

// TypeScript types generated from the schemas
export type EnrollmentCreateInput = Static<typeof enrollmentCreateSchema>
export type EnrollmentResponse = Static<typeof enrollmentResponseSchema>
export type DetailedEnrollmentResponse = Static<typeof detailedEnrollmentResponseSchema>
