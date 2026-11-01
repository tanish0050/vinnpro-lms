import { useState, useEffect } from 'react'
import { Users, Search, Trash2, Shield, UserCheck } from 'lucide-react'
import { Card, Badge } from '../../components/ui/SharedUI'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [filterRole, setFilterRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = () => {
    axios.get(`/admin/users${filterRole ? `?role=${filterRole}` : ''}`)
      .then(res => setUsers(res.data.data || []))
      .catch(() => {})
  }

  useEffect(() => {
    fetchUsers()
  }, [filterRole])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return
    try {
      await axios.delete(`/admin/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>User Management</h1>
          <p className="text-xs text-muted">View, filter, and manage platform roles</p>
        </div>
        <div className="flex gap-2">
          {['', 'STUDENT', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                filterRole === r ? 'border-primary bg-primary/20 text-white' : 'border-border text-muted'
              }`}
            >
              {r || 'All Roles'}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none"
            style={{ color: 'var(--text)' }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-muted border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-white/5 transition">
                  <td className="p-3.5 flex items-center gap-3">
                    <img src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-semibold" style={{ color: 'var(--text)' }}>{u.name}</div>
                      <div className="text-xs text-muted">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'TEACHER' ? 'primary' : 'success'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
