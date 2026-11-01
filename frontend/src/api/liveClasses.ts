import api from './axios'

export const liveClassesApi = {
  getLiveClasses: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/live-classes', { params }),

  getLiveClass: (classId: string) =>
    api.get(`/live-classes/${classId}`),

  scheduleClass: (data: {
    title: string
    description?: string
    courseId?: string
    scheduledAt: string
    duration: number
    platform: 'JITSI' | 'BBB' | 'ZOOM'
    meetingUrl?: string
  }) =>
    api.post('/live-classes', data),

  updateClass: (classId: string, data: object) =>
    api.put(`/live-classes/${classId}`, data),

  cancelClass: (classId: string) =>
    api.put(`/live-classes/${classId}/cancel`),

  joinClass: (classId: string) =>
    api.post(`/live-classes/${classId}/join`),

  getUpcomingClasses: () =>
    api.get('/live-classes/upcoming'),

  getPastRecordings: () =>
    api.get('/live-classes/recordings'),
}
