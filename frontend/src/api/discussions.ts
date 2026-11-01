import api from './axios'

export const discussionsApi = {
  getDiscussions: (courseId?: string, params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/discussions', { params: { courseId, ...params } }),

  getThread: (threadId: string) =>
    api.get(`/discussions/${threadId}`),

  createThread: (data: { title: string; content: string; courseId?: string; tags?: string[] }) =>
    api.post('/discussions', data),

  replyToThread: (threadId: string, content: string) =>
    api.post(`/discussions/${threadId}/reply`, { content }),

  likeThread: (threadId: string) =>
    api.put(`/discussions/${threadId}/like`),

  likeReply: (threadId: string, replyId: string) =>
    api.put(`/discussions/${threadId}/replies/${replyId}/like`),

  pinThread: (threadId: string) =>
    api.put(`/discussions/${threadId}/pin`),

  deleteThread: (threadId: string) =>
    api.delete(`/discussions/${threadId}`),

  deleteReply: (threadId: string, replyId: string) =>
    api.delete(`/discussions/${threadId}/replies/${replyId}`),
}
