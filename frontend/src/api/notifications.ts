import api from './axios'

export const notificationsApi = {
  getNotifications: (params?: { page?: number; limit?: number; unread?: boolean }) =>
    api.get('/notifications', { params }),

  markRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),

  markAllRead: () =>
    api.put('/notifications/mark-all-read'),

  deleteNotification: (notificationId: string) =>
    api.delete(`/notifications/${notificationId}`),

  getUnreadCount: () =>
    api.get('/notifications/unread-count'),
}
