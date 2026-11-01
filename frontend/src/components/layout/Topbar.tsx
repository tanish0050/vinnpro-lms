import { Menu, Bell, Search, Sparkles } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useNotificationStore } from '../../store/useNotificationStore'
import ThemeSwitcher from './ThemeSwitcher'
import Avatar from '../ui/Avatar'
import { Link } from 'react-router-dom'

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore()
  const { unreadCount, togglePanel } = useNotificationStore()

  return (
    <header
      className="h-16 border-b px-4 md:px-6 flex items-center justify-between z-30 transition-theme"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg md:hidden border hover:opacity-80 transition"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <Menu size={20} />
        </button>

        {/* Search bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search courses, lessons, topics..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* AI Tutor shortcut pill */}
        <Link
          to={user?.role === 'STUDENT' ? '/student/ai-tutor' : '#'}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-primary/30 transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#ffffff'
          }}
        >
          <Sparkles size={14} />
          <span>AI Tutor Active</span>
        </Link>

        {/* 6-Color Theme Switcher */}
        <ThemeSwitcher />

        {/* Notification Bell */}
        <button
          onClick={togglePanel}
          className="relative p-2 rounded-lg border hover:opacity-80 transition"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)',
            color: 'var(--text)'
          }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border hover:opacity-90 transition"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)'
          }}
        >
          <Avatar src={user?.avatar} name={user?.name} size="sm" />
          <div className="hidden sm:block text-left text-xs leading-tight">
            <div className="font-semibold" style={{ color: 'var(--text)' }}>
              {user?.name || 'Account'}
            </div>
            <div className="text-[10px] capitalize font-medium text-muted">
              {user?.role?.toLowerCase() || 'learner'}
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}
