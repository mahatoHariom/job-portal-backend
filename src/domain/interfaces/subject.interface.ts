import { Subject } from '@prisma/client'

export interface ISubjectRepository {
  getAllSubjects(): Promise<Subject[]>

  createUserSubjectEnrollment(userId: string, subjectId: string): Promise<void>

  findUserSubjectEnrollment(userId: string, subjectId: string): Promise<any>

  getSubjectById(subjectId: string): Promise<Subject | null>

  getUserSubjects(
    userId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    subjects: Subject[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }>
}
