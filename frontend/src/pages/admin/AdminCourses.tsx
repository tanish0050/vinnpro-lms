import { useState, useEffect } from 'react'
import {
  BookOpen, Star, Users, Pencil, Trash2, Plus, Search,
  CheckCircle2, XCircle, Filter, TrendingUp, DollarSign, X
} from 'lucide-react'
import { Card, Badge, Modal } from '../../components/ui/SharedUI'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: 'success',
  INTERMEDIATE: 'warning',
  ADVANCED: 'danger',
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editCourse, setEditCourse] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '', description: '', category: 'Programming',
    level: 'BEGINNER', price: 0, isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
  })

  const fetchCourses = () => {
    setLoading(true)
    axios.get('/courses?per_page=50')
      .then(res => {
        const raw = res.data?.data
        // API returns {courses: [...]} inside data
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.courses) ? raw.courses
          : []
        setCourses(list)
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCourses() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will unpublish the course.`)) return
    try {
      await axios.delete(`/courses/${id}`)
      toast.success('Course removed')
      fetchCourses()
    } catch {
      toast.error('Failed to delete course')
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCourse) return
    setSaving(true)
    try {
      await axios.put(`/courses/${editCourse._id}`, {
        title: editCourse.title,
        description: editCourse.description,
        category: editCourse.category,
        level: editCourse.level,
        price: editCourse.price,
        isFree: editCourse.isFree,
        thumbnail: editCourse.thumbnail,
        isPublished: editCourse.isPublished,
      })
      toast.success('Course updated!')
      setEditCourse(null)
      fetchCourses()
    } catch {
      toast.error('Failed to update course')
    } finally {
      setSaving(false)
    }
  }

  const filtered = courses.filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  const totalStudents = courses.reduce((a, c) => a + (c.studentsCount || 0), 0)
  const totalRevenue = courses.reduce((a, c) => a + (!c.isFree ? (c.price || 0) * (c.studentsCount || 0) : 0), 0)
  const freeCount = courses.filter(c => c.isFree).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Course Management</h1>
          <p className="text-xs text-muted mt-0.5">Manage all published courses, edit details, and remove outdated content</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <BookOpen size={20} className="mx-auto mb-1" style={{ color: 'var(--primary)' }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{courses.length}</div>
          <p className="text-xs text-muted">Total Courses</p>
        </Card>
        <Card className="text-center py-4">
          <Users size={20} className="mx-auto mb-1 text-emerald-400" />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{totalStudents}</div>
          <p className="text-xs text-muted">Enrollments</p>
        </Card>
        <Card className="text-center py-4">
          <CheckCircle2 size={20} className="mx-auto mb-1 text-sky-400" />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{freeCount}</div>
          <p className="text-xs text-muted">Free Courses</p>
        </Card>
        <Card className="text-center py-4">
          <DollarSign size={20} className="mx-auto mb-1 text-amber-400" />
          <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>₹{totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted">Est. Revenue</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search courses by title or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="h-40 rounded-t-2xl bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-white/5 rounded-full w-1/3" />
                <div className="h-4 bg-white/5 rounded-full w-3/4" />
                <div className="h-3 bg-white/5 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <Card className="text-center py-16">
          <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
          <h3 className="font-bold" style={{ color: 'var(--text)' }}>No courses found</h3>
          <p className="text-xs text-muted mt-1">Try a different search term</p>
        </Card>
      )}

      {/* Course Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <Card key={c._id} className="overflow-hidden p-0 flex flex-col hover:border-primary/40 transition-all">
              <div className="relative">
                <img
                  src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                  className="w-full h-40 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' }}
                  alt={c.title}
                />
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    c.level === 'BEGINNER' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    c.level === 'INTERMEDIATE' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>{c.level}</span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isFree ? 'bg-emerald-500 text-white' : 'bg-black/60 text-white border border-white/20'}`}>
                    {c.isFree ? 'FREE' : `₹${c.price}`}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="primary" className="mb-2">{c.category}</Badge>
                  <h3 className="font-bold text-sm line-clamp-1 mt-1" style={{ color: 'var(--text)' }}>{c.title}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{c.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {c.rating || '4.8'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {c.studentsCount || 0}
                    </span>
                    <span className={`flex items-center gap-1 ${c.isPublished ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {c.isPublished ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {c.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Edit & Delete buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditCourse({ ...c })}
                      className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 transition border border-sky-500/20"
                      title="Edit Course"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id, c.title)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition border border-rose-500/20"
                      title="Delete Course"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Course Modal */}
      <Modal isOpen={!!editCourse} onClose={() => setEditCourse(null)} title="Edit Course">
        {editCourse && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Course Title</label>
              <input
                type="text"
                value={editCourse.title}
                onChange={e => setEditCourse({ ...editCourse, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Description</label>
              <textarea
                rows={3}
                value={editCourse.description}
                onChange={e => setEditCourse({ ...editCourse, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none resize-none"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Category</label>
                <select
                  value={editCourse.category}
                  onChange={e => setEditCourse({ ...editCourse, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  {['Programming', 'Data Science', 'Web Development', 'Computer Science', 'Design'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Level</label>
                <select
                  value={editCourse.level}
                  onChange={e => setEditCourse({ ...editCourse, level: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editCourse.price}
                  onChange={e => setEditCourse({ ...editCourse, price: +e.target.value, isFree: +e.target.value === 0 })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Status</label>
                <div className="flex gap-2 pt-1">
                  {[true, false].map(v => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setEditCourse({ ...editCourse, isPublished: v })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${editCourse.isPublished === v ? 'text-white' : 'text-muted'}`}
                      style={editCourse.isPublished === v ? { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderColor: 'transparent' } : { borderColor: 'var(--border)' }}
                    >
                      {v ? '✅ Live' : '⬜ Draft'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Thumbnail URL</label>
              <input
                type="url"
                value={editCourse.thumbnail}
                onChange={e => setEditCourse({ ...editCourse, thumbnail: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Pencil size={15} /> Save Changes</>}
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
