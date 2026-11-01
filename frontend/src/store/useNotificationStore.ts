import { create } from 'zustand'

export interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markRead: (id: string) => void
  markAllRead: () => void
  togglePanel: () => void
  closePanel: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter(n => !n.read).length }),
  addNotification: (notification) =>
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),
  markRead: (id) =>
    set(state => ({
      notifications: state.notifications.map(n => n._id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  togglePanel: () => set(state => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),
}))
