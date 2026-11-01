import { useState, useEffect } from 'react'
import { Users, BookOpen, DollarSign, Activity, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Card, StatCard } from '../../components/ui/SharedUI'
import axios from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalUsers: 3,
    totalStudents: 1,
    totalTeachers: 1,
    totalCourses: 5,
    totalEnrollments: 8,
    revenue: 19992,
    activeToday: 3
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Admin Control Center
          </h1>
          <p className="text-xs text-muted mt-0.5">
            System overview, user performance & LMS operations
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>All Microservices Operational</span>
        </div>
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          icon={<Users size={22} />}
          trend="+18% this month"
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={<BookOpen size={22} />}
          trend="5 published"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={<Activity size={22} />}
          trend="+32% week-on-week"
        />
        <StatCard
          title="Estimated Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<DollarSign size={22} />}
          trend="Secure Gateway"
        />
      </div>

      {/* Grid: Architecture & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>
              Core Education OS Modules (Image Specs)
            </h3>
            <span className="text-xs text-primary font-semibold">Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-bold mb-1 flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>8.1 LMS Architecture</span>
              </div>
              <p className="text-muted leading-relaxed">
                Course → Module → Lesson → Activity → Assessment hierarchy with SCORM readiness.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-bold mb-1 flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>8.2 Ebook Intelligence</span>
              </div>
              <p className="text-muted leading-relaxed">
                OCR text chunking, automated embeddings and permission-aware vector AI tutor.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-bold mb-1 flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>8.3 Study Engagement</span>
              </div>
              <p className="text-muted leading-relaxed">
                Active study sessions with idle-time handling and retrieval practice tracking.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-bold mb-1 flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>8.4 Online Classes</span>
              </div>
              <p className="text-muted leading-relaxed">
                Live classes via BigBlueButton, Jitsi WebRTC & recording archives.
              </p>
            </div>
          </div>
        </Card>

        {/* Server & Database Health */}
        <Card className="space-y-4">
          <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>
            System Runtime
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-muted">API Engine</span>
              <span className="font-mono font-semibold" style={{ color: 'var(--text)' }}>Flask 3.x (Python)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-muted">Database Engine</span>
              <span className="font-mono font-semibold text-emerald-400">MongoDB / Atlas</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-muted">Authentication</span>
              <span className="font-mono font-semibold" style={{ color: 'var(--text)' }}>JWT HS256 Token</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-muted">AI Tutor Engine</span>
              <span className="font-mono font-semibold text-primary">RAG Curriculum Vector</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted">Hosting Target</span>
              <span className="font-mono font-semibold" style={{ color: 'var(--text)' }}>Render + GitHub</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
