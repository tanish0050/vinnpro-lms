import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  _id: string
  name: string
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  avatar?: string
  bio?: string
  phone?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: 'vinnpro-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
