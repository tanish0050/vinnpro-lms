import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, BarChart3,
  Settings, LogOut, X, PlusCircle, FileText, Video, Trophy,
  MessageSquare, Brain, TrendingUp, Award, Library, CheckSquare,
  Calendar, Radio
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  { to: '/admin/courses', label: 'Courses', icon: <BookOpen size={18} /> },
  { to: '/admin/meetings', label: 'Meetings', icon: <Radio size={18} /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { to: '/admin/ebooks', label: 'E-Library', icon: <Library size={18} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
]

const teacherNav: NavItem[] = [
  { to: '/teacher', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/teacher/create-course', label: 'Create Course', icon: <PlusCircle size={18} /> },
  { to: '/teacher/grade-submissions', label: 'Grade Work', icon: <CheckSquare size={18} /> },
  { to: '/teacher/analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
  { to: '/teacher/schedule-class', label: 'Schedule Class', icon: <Calendar size={18} /> },
  { to: '/teacher/live-classes', label: 'Live Classes', icon: <Video size={18} /> },
  { to: '/teacher/ebooks', label: 'E-Library', icon: <Library size={18} /> },
]

const studentNav: NavItem[] = [
  { to: '/student', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/student/catalog', label: 'Course Catalog', icon: <BookOpen size={18} /> },
  { to: '/student/ai-tutor', label: 'AI Tutor', icon: <Brain size={18} /> },
  { to: '/student/discussions', label: 'Discussions', icon: <MessageSquare size={18} /> },
  { to: '/student/progress', label: 'My Progress', icon: <TrendingUp size={18} /> },
  { to: '/student/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
  { to: '/student/live-classes', label: 'Live Classes', icon: <Video size={18} /> },
  { to: '/student/ebooks', label: 'E-Library', icon: <Library size={18} /> },
]


interface SidebarProps {
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === 'ADMIN' ? adminNav
    : user?.role === 'TEACHER' ? teacherNav
    : studentNav

  const profilePath = `/${user?.role?.toLowerCase()}/profile`

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen flex flex-col"
      style={{
        backgroundColor: 'var(--card)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: 'var(--text)' }}>VinnPro</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>AI Education OS</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-lg hover:bg-surface transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
            onClick={onClose}
            className={({ isActive }) =>
              clsx('sidebar-link', isActive && 'active')
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Bottom */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => { navigate(profilePath); onClose() }}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors mb-2"
        >
          <Avatar name={user?.name || 'U'} src={user?.avatar} size="sm" />
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user?.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </button>
        <button
          onClick={logout}
          className="sidebar-link w-full text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  )
}
