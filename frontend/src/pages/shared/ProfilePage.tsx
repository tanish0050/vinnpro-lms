import { useState } from 'react'
import { Card, Badge } from '../../components/ui/SharedUI'
import { useAuthStore } from '../../store/useAuthStore'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, Shield, Award, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile preferences updated!')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>User Profile</h1>
          <p className="text-xs text-muted">Manage your credentials, bio, and role permissions</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>

      <Card className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            className="w-16 h-16 rounded-2xl border-2 border-primary/50 shadow-md"
          />
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{user?.name}</h3>
            <p className="text-xs text-muted">{user?.email}</p>
            <div className="mt-1">
              <Badge variant="primary">{user?.role}</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-muted">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted">Bio & Goals</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others what you are studying or teaching..."
              className="w-full p-2.5 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            Save Changes
          </button>
        </form>
      </Card>
    </div>
  )
}
