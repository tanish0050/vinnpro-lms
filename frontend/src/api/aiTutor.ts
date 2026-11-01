import api from './axios'

export const aiTutorApi = {
  sendMessage: (message: string, conversationId?: string, courseContext?: string) =>
    api.post('/ai-tutor/chat', { message, conversationId, courseContext }),

  getConversations: () =>
    api.get('/ai-tutor/conversations'),

  getConversation: (conversationId: string) =>
    api.get(`/ai-tutor/conversations/${conversationId}`),

  deleteConversation: (conversationId: string) =>
    api.delete(`/ai-tutor/conversations/${conversationId}`),

  getSuggestedQuestions: (courseContext?: string) =>
    api.get('/ai-tutor/suggested-questions', { params: { courseContext } }),
}
