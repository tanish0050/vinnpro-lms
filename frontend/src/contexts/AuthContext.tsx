import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

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

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, token, setUser, setToken, clearAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axiosInstance.get('/auth/me')
        .then(res => {
          setUser(res.data.data || res.data.user || res.data)
        })
        .catch(() => {
          clearAuth()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post('/auth/login', { email, password })
    const data = res.data
    const inner = data.data || {}
    const authToken = inner.access_token || data.token || data.accessToken
    const userData = inner.user || data.user
    setToken(authToken)
    setUser(userData)
    toast.success(`Welcome back, ${userData?.name || 'User'}!`)
    return userData
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    const res = await axiosInstance.post('/auth/register', { name, email, password, role })
    const data = res.data
    const inner = data.data || {}
    const authToken = inner.access_token || data.token || data.accessToken
    const userData = inner.user || data.user
    setToken(authToken)
    setUser(userData)
    toast.success(`Welcome to VinnPro, ${userData?.name || 'Student'}!`)
  }

  const logout = () => {
    clearAuth()
    toast.success('Logged out successfully')
    window.location.href = '/login'
  }

  const updateProfile = async (profileData: Partial<User>) => {
    const res = await axiosInstance.put('/auth/profile', profileData)
    const updated = res.data.data || res.data.user || res.data
    setUser(updated)
    toast.success('Profile updated!')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
