import api from './axios'

export interface Course {
  _id: string
  title: string
  description: string
  thumbnail?: string
  category: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  price: number
  isPublished: boolean
  instructor: { _id: string; name: string; avatar?: string }
  modules: Module[]
  enrollmentCount: number
  rating: number
  duration?: number
  tags?: string[]
  createdAt: string
}

export interface Module {
  _id: string
  title: string
  lessons: Lesson[]
  order: number
}

export interface Lesson {
  _id: string
  title: string
  contentType: 'VIDEO' | 'PDF' | 'HTML' | 'QUIZ'
  content?: string
  videoUrl?: string
  duration?: number
  order: number
  isCompleted?: boolean
}

export const coursesApi = {
  getCourses: (params?: { page?: number; limit?: number; category?: string; level?: string; search?: string; published?: boolean }) =>
    api.get('/courses', { params }),

  getCourse: (courseId: string) =>
    api.get(`/courses/${courseId}`),

  createCourse: (data: Partial<Course>) =>
    api.post('/courses', data),

  updateCourse: (courseId: string, data: Partial<Course>) =>
    api.put(`/courses/${courseId}`, data),

  deleteCourse: (courseId: string) =>
    api.delete(`/courses/${courseId}`),

  publishCourse: (courseId: string) =>
    api.put(`/courses/${courseId}/publish`),

  unpublishCourse: (courseId: string) =>
    api.put(`/courses/${courseId}/unpublish`),

  enrollCourse: (courseId: string) =>
    api.post(`/courses/${courseId}/enroll`),

  getEnrolledCourses: () =>
    api.get('/courses/enrolled'),

  getMyCourses: () =>
    api.get('/courses/my-courses'),

  trackProgress: (courseId: string, lessonId: string) =>
    api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),

  getCourseProgress: (courseId: string) =>
    api.get(`/courses/${courseId}/progress`),

  addModule: (courseId: string, data: { title: string; order: number }) =>
    api.post(`/courses/${courseId}/modules`, data),

  updateModule: (courseId: string, moduleId: string, data: { title: string }) =>
    api.put(`/courses/${courseId}/modules/${moduleId}`, data),

  deleteModule: (courseId: string, moduleId: string) =>
    api.delete(`/courses/${courseId}/modules/${moduleId}`),

  addLesson: (courseId: string, moduleId: string, data: Partial<Lesson>) =>
    api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data),

  updateLesson: (courseId: string, moduleId: string, lessonId: string, data: Partial<Lesson>) =>
    api.put(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data),

  deleteLesson: (courseId: string, moduleId: string, lessonId: string) =>
    api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`),

  getReviews: (courseId: string) =>
    api.get(`/courses/${courseId}/reviews`),

  addReview: (courseId: string, data: { rating: number; review: string }) =>
    api.post(`/courses/${courseId}/reviews`, data),
}
