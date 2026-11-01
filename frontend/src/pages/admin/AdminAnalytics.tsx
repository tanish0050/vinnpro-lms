import { useState, useEffect } from 'react'
import { Card, StatCard } from '../../components/ui/SharedUI'
import { TrendingUp, Users, Award, Activity, RefreshCw, BookOpen, Clock, Zap } from 'lucide-react'
import axios from '../../api/axios'

// Simulated live data that updates every few seconds
function useLiveStats() {
  const [liveUsers, setLiveUsers] = useState(Math.floor(Math.random() * 20) + 40)
  const [liveHours, setLiveHours] = useState(Math.floor(Math.random() * 10) + 120)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => Math.max(30, prev + Math.floor(Math.random() * 7) - 3))
      setLiveHours(prev => Math.min(500, prev + Math.floor(Math.random() * 3)))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return { liveUsers, liveHours }
}

const dailyStats = [
  { day: 'Mon', active: 120, hours: 240 },
  { day: 'Tue', active: 160, hours: 310 },
  { day: 'Wed', active: 145, hours: 280 },
  { day: 'Thu', active: 210, hours: 420 },
  { day: 'Fri', active: 195, hours: 390 },
  { day: 'Sat', active: 280, hours: 540 },
  { day: 'Sun', active: 240, hours: 480 },
]

const maxActive = Math.max(...dailyStats.map(d => d.active))

export default function AdminAnalytics() {
  const { liveUsers, liveHours } = useLiveStats()
  const [studyData, setStudyData] = useState<any[]>([])
  const [totalEnrollments, setTotalEnrollments] = useState(0)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [pulse, setPulse] = useState(false)

  // Blink effect every time live stats update
  useEffect(() => {
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 500)
    return () => clearTimeout(t)
  }, [liveUsers])

  useEffect(() => {
    axios.get('/courses?per_page=50')
      .then(res => {
        const raw = res.data?.data
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.courses) ? raw.courses : []
        const totalEnr = list.reduce((a: number, c: any) => a + (c.studentsCount || 0), 0)
        setTotalEnrollments(totalEnr)

        // Build fake per-subject study hours from seed courses
        setStudyData(list.map((c: any) => ({
          title: c.title,
          studyHours: Math.floor(Math.random() * 200) + 50,
          students: c.studentsCount || 0,
          completion: Math.floor(Math.random() * 60) + 20,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 55%)`
        })))
        setLastRefresh(new Date())
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Platform Analytics
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Live engagement monitoring — Last refreshed: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span style={{ color: 'var(--text)' }}>LIVE</span>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Live active users - pulses */}
        <Card className={`relative overflow-hidden transition-all duration-300 ${pulse ? 'border-emerald-400/60' : ''}`}>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-xs text-muted mb-1 flex items-center gap-1"><Activity size={12} className="text-emerald-400" /> Active Now</div>
          <div className={`text-3xl font-black transition-all duration-500 ${pulse ? 'text-emerald-400' : ''}`} style={{ color: pulse ? '#34d399' : 'var(--text)' }}>
            {liveUsers}
          </div>
          <p className="text-xs text-emerald-400 font-semibold">Students online</p>
        </Card>

        <Card>
          <div className="text-xs text-muted mb-1 flex items-center gap-1"><Clock size={12} className="text-sky-400" /> Study Hours</div>
          <div className="text-3xl font-black" style={{ color: 'var(--text)' }}>{liveHours}</div>
          <p className="text-xs text-sky-400 font-semibold">Today total</p>
        </Card>

        <Card>
          <div className="text-xs text-muted mb-1 flex items-center gap-1"><Users size={12} style={{ color: 'var(--primary)' }} /> Enrollments</div>
          <div className="text-3xl font-black" style={{ color: 'var(--text)' }}>{totalEnrollments}</div>
          <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>All-time</p>
        </Card>

        <Card>
          <div className="text-xs text-muted mb-1 flex items-center gap-1"><Award size={12} className="text-amber-400" /> Completion</div>
          <div className="text-3xl font-black" style={{ color: 'var(--text)' }}>78%</div>
          <p className="text-xs text-amber-400 font-semibold">Avg. rate</p>
        </Card>
      </div>

      {/* Weekly Activity Bar Chart */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Weekly Active Learner Trend</h3>
          <span className="text-xs text-muted">Daily active students</span>
        </div>
        <div className="grid grid-cols-7 gap-2 pt-4">
          {dailyStats.map(d => (
            <div key={d.day} className="text-center group">
              <div className="h-40 flex items-end justify-center rounded-xl p-1.5 relative" style={{ backgroundColor: 'var(--surface)' }}>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                  {d.active} active · {d.hours}h
                </div>
                <div
                  className="w-full rounded-lg transition-all duration-500 hover:opacity-90 cursor-pointer"
                  style={{
                    height: `${(d.active / maxActive) * 100}%`,
                    background: 'linear-gradient(180deg, var(--primary), var(--secondary))'
                  }}
                />
              </div>
              <div className="text-xs font-semibold mt-2" style={{ color: 'var(--text)' }}>{d.day}</div>
              <div className="text-[10px] text-muted">{d.active}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Per-Course Study Hours */}
      {studyData.length > 0 && (
        <Card className="space-y-4">
          <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Study Hours by Course</h3>
          <div className="space-y-3">
            {studyData.slice(0, 6).map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold line-clamp-1 max-w-xs" style={{ color: 'var(--text)' }}>{c.title}</span>
                  <span className="text-muted shrink-0 ml-2">{c.studyHours}h · {c.students} students</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(c.studyHours / 250) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Engagement Metrics Table */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Platform Engagement Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Avg. Session Duration', value: '24 min', icon: <Clock size={16} className="text-sky-400" />, trend: '+3m vs last week' },
            { label: 'AI Tutor Queries / Day', value: '142', icon: <Zap size={16} className="text-amber-400" />, trend: 'Peak at 7-9pm' },
            { label: 'Quiz Attempts / Day', value: '89', icon: <BookOpen size={16} style={{ color: 'var(--primary)' }} />, trend: 'Avg score: 72%' },
            { label: 'Live Classes Attended', value: '238', icon: <Activity size={16} className="text-emerald-400" />, trend: 'This month' },
            { label: 'Discussion Posts', value: '47', icon: <Users size={16} className="text-indigo-400" />, trend: 'This week' },
            { label: 'Certifications Issued', value: '12', icon: <Award size={16} className="text-amber-400" />, trend: 'This month' },
          ].map((m, i) => (
            <div key={i} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                {m.icon}
                <span className="text-xs text-muted">{m.label}</span>
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>{m.value}</div>
              <div className="text-[10px] text-muted mt-1">{m.trend}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
