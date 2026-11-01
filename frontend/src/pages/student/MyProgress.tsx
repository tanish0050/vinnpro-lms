import { Card, StatCard, ProgressBar } from '../../components/ui/SharedUI'
import { TrendingUp, Award, Flame, CheckCircle2, Clock } from 'lucide-react'

export default function MyProgress() {
  const days = [
    { day: 'Mon', mins: 45 },
    { day: 'Tue', mins: 60 },
    { day: 'Wed', mins: 30 },
    { day: 'Thu', mins: 90 },
    { day: 'Fri', mins: 75 },
    { day: 'Sat', mins: 120 },
    { day: 'Sun', mins: 85 },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>My Learning Journey & Analytics</h1>
        <p className="text-xs text-muted">Section 8.3 Student Study & Engagement Tracking (idle-time aware)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Active Study Time" value="8.4 hrs" icon={<Clock size={20} />} trend="This week" />
        <StatCard title="Current Streak" value="4 Days" icon={<Flame size={20} />} trend="🔥 Record: 12" />
        <StatCard title="Total XP Earned" value="320 XP" icon={<Award size={20} />} trend="Rank: #3" />
      </div>

      {/* Weekly Activity Chart */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Active Study Sessions (Minutes / Day)</h3>
        <div className="grid grid-cols-7 gap-2 pt-4">
          {days.map(d => (
            <div key={d.day} className="text-center">
              <div className="h-36 flex items-end justify-center rounded-xl p-1" style={{ backgroundColor: 'var(--surface)' }}>
                <div
                  className="w-full rounded-lg transition-all"
                  style={{
                    height: `${(d.mins / 120) * 100}%`,
                    background: 'linear-gradient(180deg, var(--primary), var(--secondary))'
                  }}
                />
              </div>
              <div className="text-xs font-semibold mt-2" style={{ color: 'var(--text)' }}>{d.day}</div>
              <div className="text-[10px] text-muted">{d.mins}m</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Course Completion breakdown */}
      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Course Completion & Milestones</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-white">Python for Beginners: Zero to Hero</span>
              <span className="text-muted">35% Completed</span>
            </div>
            <ProgressBar progress={35} showLabel={false} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-white">Web Development with React & Flask</span>
              <span className="text-muted">60% Completed</span>
            </div>
            <ProgressBar progress={60} showLabel={false} />
          </div>
        </div>
      </Card>
    </div>
  )
}
