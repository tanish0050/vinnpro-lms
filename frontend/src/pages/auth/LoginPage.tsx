import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, ShieldCheck, BookOpen, KeyRound, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ThemeSwitcher from '../../components/layout/ThemeSwitcher'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT')
  const [email, setEmail] = useState('student@vinnpro.com')
  const [password, setPassword] = useState('Student@123')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (selectedRole: 'STUDENT' | 'ADMIN') => {
    setRole(selectedRole)
    if (selectedRole === 'ADMIN') {
      setEmail('admin@vinnpro.com')
      setPassword('Admin@123')
    } else {
      setEmail('student@vinnpro.com')
      setPassword('Student@123')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const userData = await login(email, password) as any
      const userRole = userData?.role || role
      if (userRole === 'ADMIN') navigate('/admin')
      else navigate('/student')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden transition-theme"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 -top-20 -left-20 pointer-events-none"
        style={{ backgroundColor: 'var(--primary)' }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 -bottom-20 -right-20 pointer-events-none"
        style={{ backgroundColor: 'var(--secondary)' }}
      />

      {/* Top right theme switcher */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeSwitcher />
      </div>

      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl p-8 z-10 backdrop-blur-xl relative"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Brand header */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            VinnPro OS
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            AI-Powered Education &amp; Learning Management Platform
          </p>
        </div>

        {/* 2 Role Selector Tabs - Student & Admin only */}
        <div
          className="grid grid-cols-2 gap-1 p-1 rounded-xl border mb-6"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <button
            type="button"
            onClick={() => handleRoleSelect('STUDENT')}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'STUDENT' ? 'shadow-md text-white' : 'text-muted hover:text-white'
            }`}
            style={{
              background: role === 'STUDENT' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent'
            }}
          >
            <BookOpen size={14} />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('ADMIN')}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'ADMIN' ? 'shadow-md text-white' : 'text-muted hover:text-white'
            }`}
            style={{
              background: role === 'ADMIN' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent'
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-muted">Password</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl border text-[11px] leading-tight" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <span className="font-semibold text-primary">Demo Account Active: </span>
            <span className="text-muted">Click Login to access with ready-to-test data.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
            }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In as {role}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-5 text-xs text-muted">
          New here?{' '}
          <Link to="/register" className="font-bold underline" style={{ color: 'var(--primary)' }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}
