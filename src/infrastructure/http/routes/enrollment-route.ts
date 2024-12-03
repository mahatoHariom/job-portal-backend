import { FastifyInstance } from 'fastify'
import { TYPES } from '@/types'
import { EnrollmentController } from '@/app/controllers/enrollment-controller'

import { Type } from '@sinclair/typebox'
import { EnrollmentCreateInput, enrollmentResponseSchema } from '@/domain/schemas/enrollment-schema'

export default async function enrollmentRoutes(fastify: FastifyInstance) {
  const enrollmentController = fastify.container.get<EnrollmentController>(TYPES.EnrollmentController)

  fastify.post<{ Body: EnrollmentCreateInput; Response: typeof enrollmentResponseSchema }>(
    '/enroll',
    {
      schema: {
        tags: ['Enrollment'],
        body: Type.Object({
          subjectId: Type.String({ minLength: 1 })
        }),
        response: {
          201: enrollmentResponseSchema
        }
      },
      onRequest: fastify.authenticate
    },
    enrollmentController.enrollUser.bind(enrollmentController)
  )

  fastify.get(
    '/my-enrollments',
    {
      schema: {
        tags: ['Enrollment'],
        response: {
          200: Type.Object({
            enrollments: Type.Array(Type.Any())
          })
        }
      },
      onRequest: fastify.authenticate
    },
    enrollmentController.getUserEnrollments.bind(enrollmentController)
  )
}
