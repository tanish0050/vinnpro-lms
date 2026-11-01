import api from './axios'

export const quizApi = {
  getQuiz: (quizId: string) =>
    api.get(`/quizzes/${quizId}`),

  getQuizzesByCourse: (courseId: string) =>
    api.get(`/quizzes/course/${courseId}`),

  submitAttempt: (quizId: string, answers: { questionId: string; answer: string }[]) =>
    api.post(`/quizzes/${quizId}/attempt`, { answers }),

  getAttempts: (quizId: string) =>
    api.get(`/quizzes/${quizId}/attempts`),

  getMyAttempts: () =>
    api.get('/quizzes/my-attempts'),

  createQuiz: (courseId: string, data: {
    title: string
    description?: string
    timeLimit?: number
    questions: { question: string; options: string[]; correctAnswer: string; explanation?: string }[]
  }) =>
    api.post(`/quizzes/course/${courseId}`, data),

  updateQuiz: (quizId: string, data: object) =>
    api.put(`/quizzes/${quizId}`, data),

  deleteQuiz: (quizId: string) =>
    api.delete(`/quizzes/${quizId}`),
}
