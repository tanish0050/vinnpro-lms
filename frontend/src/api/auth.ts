import api from './axios'

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, role: string) =>
    api.post('/auth/register', { name, email, password, role }),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data: { name?: string; bio?: string; phone?: string; avatar?: string }) =>
    api.put('/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  uploadAvatar: (formData: FormData) =>
    api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
