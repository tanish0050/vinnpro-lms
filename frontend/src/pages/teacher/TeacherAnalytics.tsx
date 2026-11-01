import { Card, StatCard } from '../../components/ui/SharedUI'
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react'

export default function TeacherAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Class Performance Analytics</h1>
        <p className="text-xs text-muted">Real-time student progress, quiz pass rates, and lesson engagement</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Average Quiz Score" value="84.2%" icon={<Award size={20} />} trend="+3.2% vs last batch" />
        <StatCard title="Lesson Drop-off Rate" value="12%" icon={<TrendingUp size={20} />} trend="Low (High Engagement)" />
        <StatCard title="Total Homework Graded" value="142" icon={<BookOpen size={20} />} trend="100% on schedule" />
      </div>

      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Engagement Highlights</h3>
        <p className="text-xs text-muted leading-relaxed">
          Students spend an average of 42 minutes per session with interactive modules and retrieval practice.
          Active session tracking handles idle-time to prevent inflated metrics.
        </p>
      </Card>
    </div>
  )
}
