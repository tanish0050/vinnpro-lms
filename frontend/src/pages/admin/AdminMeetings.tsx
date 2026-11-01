import { useState, useEffect } from 'react'
import { Video, Plus, Trash2, Radio, Clock, Users, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Card, Modal, Badge } from '../../components/ui/SharedUI'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  UPCOMING: { label: 'Upcoming', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: Clock },
  LIVE: { label: 'LIVE NOW', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse', icon: Radio },
  ENDED: { label: 'Ended', color: 'bg-white/10 text-muted border-white/10', icon: CheckCircle2 },
}

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 60,
    platform: 'Jitsi',
    meetingUrl: '',
    status: 'UPCOMING',
  })
  const [creating, setCreating] = useState(false)

  const fetchMeetings = () => {
    axios.get('/live-classes')
      .then(res => {
        const raw = res.data
        const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : []
        setMeetings(list)
      })
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchMeetings() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    setCreating(true)
    try {
      await axios.post('/live-classes/admin/create', form)
      toast.success('Meeting created successfully!')
      setShowCreate(false)
      setForm({ title: '', description: '', duration: 60, platform: 'Jitsi', meetingUrl: '', status: 'UPCOMING' })
      fetchMeetings()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to create meeting')
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.put(`/live-classes/admin/${id}/status`, { status })
      toast.success(`Meeting marked as ${status}`)
      fetchMeetings()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this meeting? Students will no longer see it.')) return
    try {
      await axios.delete(`/live-classes/admin/${id}`)
      toast.success('Meeting deleted')
      fetchMeetings()
    } catch {
      toast.error('Failed to delete meeting')
    }
  }

  const liveCount = meetings.filter(m => m.status === 'LIVE').length
  const upcomingCount = meetings.filter(m => m.status === 'UPCOMING').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Meeting Management
          </h1>
          <p className="text-xs text-muted mt-0.5">Create and manage live classes for all students</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          <Plus size={16} />
          New Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center py-4">
          <Radio size={22} className="mx-auto text-rose-400 mb-1" />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{liveCount}</div>
          <p className="text-xs text-muted">Live Now</p>
        </Card>
        <Card className="text-center py-4">
          <Clock size={22} className="mx-auto mb-1" style={{ color: 'var(--primary)' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{upcomingCount}</div>
          <p className="text-xs text-muted">Upcoming</p>
        </Card>
        <Card className="text-center py-4">
          <Users size={22} className="mx-auto mb-1 text-emerald-400" />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{meetings.length}</div>
          <p className="text-xs text-muted">Total</p>
        </Card>
      </div>

      {/* Meetings List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <Card className="text-center py-16">
          <Video size={40} className="mx-auto mb-3 opacity-20" />
          <h3 className="font-bold" style={{ color: 'var(--text)' }}>No meetings yet</h3>
          <p className="text-xs text-muted mt-1">Create your first meeting to get started</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            Create Meeting
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {meetings.map(m => {
            const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.UPCOMING
            const StatusIcon = cfg.icon
            return (
              <Card key={m._id} className={`hover:border-primary/30 transition-all ${m.status === 'LIVE' ? 'border-rose-500/40 shadow-rose-500/10 shadow-lg' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl border ${m.status === 'LIVE' ? 'bg-rose-500/20 border-rose-500/30' : 'bg-primary/10 border-primary/20'}`}>
                      <StatusIcon size={18} className={m.status === 'LIVE' ? 'text-rose-400' : ''} style={m.status !== 'LIVE' ? { color: 'var(--primary)' } : {}} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{m.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      {m.description && <p className="text-xs text-muted mt-0.5">{m.description}</p>}
                      <div className="flex gap-3 text-xs text-muted mt-1">
                        <span className="flex items-center gap-1"><Clock size={11} />{m.duration} mins</span>
                        <span className="flex items-center gap-1"><Users size={11} />{m.maxStudents} max</span>
                        <span className="font-medium" style={{ color: 'var(--primary)' }}>{m.platform}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {m.meetingUrl && (
                      <a href={m.meetingUrl} target="_blank" rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1"
                        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                        <ExternalLink size={12} /> Open
                      </a>
                    )}

                    {m.status !== 'LIVE' && (
                      <button
                        onClick={() => handleStatusChange(m._id, 'LIVE')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 hover:bg-rose-500/30 transition"
                      >
                        <Radio size={12} /> Go Live
                      </button>
                    )}
                    {m.status === 'LIVE' && (
                      <button
                        onClick={() => handleStatusChange(m._id, 'ENDED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-muted border border-white/10 flex items-center gap-1 hover:bg-white/20 transition"
                      >
                        <XCircle size={12} /> End
                      </button>
                    )}
                    {m.status === 'ENDED' && (
                      <button
                        onClick={() => handleStatusChange(m._id, 'UPCOMING')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                        style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      >
                        <AlertCircle size={12} /> Reschedule
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(m._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Meeting Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Meeting">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Meeting Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Python Basics - Week 1"
              required
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="What will students learn in this session?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Platform</label>
              <select
                value={form.platform}
                onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <option value="Jitsi">Jitsi Meet</option>
                <option value="BigBlueButton">BigBlueButton</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Duration (mins)</label>
              <input
                type="number"
                value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))}
                min={15}
                max={480}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Meeting URL (optional)</label>
            <input
              type="url"
              value={form.meetingUrl}
              onChange={e => setForm(p => ({ ...p, meetingUrl: e.target.value }))}
              placeholder="https://meet.jit.si/your-room (auto-generated if empty)"
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Initial Status</label>
            <div className="grid grid-cols-2 gap-2">
              {['UPCOMING', 'LIVE'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: s }))}
                  className={`py-2 rounded-xl border text-xs font-bold transition ${form.status === s ? 'text-white' : 'text-muted'}`}
                  style={form.status === s ? { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderColor: 'transparent' } : { borderColor: 'var(--border)' }}
                >
                  {s === 'LIVE' ? '🔴 Go Live Immediately' : '📅 Schedule (Upcoming)'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            {creating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={16} /> Create Meeting</>}
          </button>
        </form>
      </Modal>
    </div>
  )
}
