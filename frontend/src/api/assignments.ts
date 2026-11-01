import api from './axios'

export const assignmentsApi = {
  getAssignment: (assignmentId: string) =>
    api.get(`/assignments/${assignmentId}`),

  getAssignmentsByCourse: (courseId: string) =>
    api.get(`/assignments/course/${courseId}`),

  getMyAssignments: () =>
    api.get('/assignments/my'),

  submitAssignment: (assignmentId: string, data: { content: string; fileUrl?: string }) =>
    api.post(`/assignments/${assignmentId}/submit`, data),

  getSubmission: (assignmentId: string) =>
    api.get(`/assignments/${assignmentId}/my-submission`),

  getPendingSubmissions: () =>
    api.get('/assignments/pending-submissions'),

  gradeSubmission: (submissionId: string, data: { score: number; feedback: string }) =>
    api.put(`/assignments/submissions/${submissionId}/grade`, data),

  createAssignment: (courseId: string, data: {
    title: string
    description: string
    dueDate: string
    maxScore: number
  }) =>
    api.post(`/assignments/course/${courseId}`, data),

  updateAssignment: (assignmentId: string, data: object) =>
    api.put(`/assignments/${assignmentId}`, data),

  deleteAssignment: (assignmentId: string) =>
    api.delete(`/assignments/${assignmentId}`),
}
