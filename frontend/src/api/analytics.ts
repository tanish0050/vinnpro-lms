import api from './axios'

export const analyticsApi = {
  getAdminStats: () =>
    api.get('/analytics/admin/stats'),

  getEnrollmentTrends: (days?: number) =>
    api.get('/analytics/admin/enrollments', { params: { days } }),

  getRevenueTrends: (months?: number) =>
    api.get('/analytics/admin/revenue', { params: { months } }),

  getCourseCategories: () =>
    api.get('/analytics/admin/categories'),

  getDailyActiveUsers: (days?: number) =>
    api.get('/analytics/admin/active-users', { params: { days } }),

  getTopCourses: () =>
    api.get('/analytics/admin/top-courses'),

  getStudentStats: () =>
    api.get('/analytics/student/stats'),

  getStudyTimeChart: () =>
    api.get('/analytics/student/study-time'),

  getQuizPerformance: () =>
    api.get('/analytics/student/quiz-performance'),

  getTeacherStats: () =>
    api.get('/analytics/teacher/stats'),

  getCoursePerformance: (courseId?: string) =>
    api.get('/analytics/teacher/course-performance', { params: { courseId } }),

  getCompletionFunnel: (courseId?: string) =>
    api.get('/analytics/teacher/completion-funnel', { params: { courseId } }),
}
