import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, User, Mail, KeyRound, BookOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ThemeSwitcher from '../../components/layout/ThemeSwitcher'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password, 'STUDENT')
      toast.success('Account created successfully! Welcome to VinnPro!')
      navigate('/student')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Background ambient lighting */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 -top-20 -left-20 pointer-events-none"
        style={{ backgroundColor: 'var(--primary)' }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 -bottom-20 -right-20 pointer-events-none"
        style={{ backgroundColor: 'var(--secondary)' }}
      />

      <div className="absolute top-6 right-6 z-20">
        <ThemeSwitcher />
      </div>

      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl p-8 backdrop-blur-xl z-10 relative"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Join VinnPro OS
          </h1>
          <p className="text-xs text-muted mt-1">Start your AI-enhanced learning journey</p>

          {/* Student badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mt-3 text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <BookOpen size={12} />
            <span>Student Account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-muted">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
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
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <p className="text-[11px] text-muted mt-1 ml-1">Password must be at least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 mt-2 transition-transform active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Student Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-5 text-xs text-muted">
          Already registered?{' '}
          <Link to="/login" className="font-bold underline" style={{ color: 'var(--primary)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
