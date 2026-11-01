import { useState, useEffect } from 'react'
import { BookOpen, Users, CheckSquare, Plus, Video, Calendar, ArrowUpRight } from 'lucide-react'
import { Card, StatCard, Badge } from '../../components/ui/SharedUI'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'

export default function TeacherDashboard() {
  const [data, setData] = useState<any>({
    coursesCount: 5,
    totalStudents: 34,
    pendingSubmissions: 2,
    averageRating: 4.8,
    courses: []
  })

  useEffect(() => {
    axios.get('/teachers/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Instructor Studio</h1>
          <p className="text-xs text-muted">Manage your curriculum, assignments, and live lectures</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/teacher/create-course"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <Plus size={16} />
            <span>Create Course</span>
          </Link>
          <Link
            to="/teacher/schedule-class"
            className="px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <Calendar size={16} />
            <span>Schedule Live Class</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Courses" value={data.coursesCount} icon={<BookOpen size={20} />} />
        <StatCard title="Enrolled Students" value={data.totalStudents} icon={<Users size={20} />} trend="+8 new this week" />
        <StatCard title="Pending Submissions" value={data.pendingSubmissions} icon={<CheckSquare size={20} />} trend="Needs grading" />
        <StatCard title="Instructor Rating" value={`★ ${data.averageRating}`} icon={<ArrowUpRight size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>My Curriculum</h3>
            <Link to="/teacher/create-course" className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>+ Add New</Link>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Python for Beginners: Zero to Hero', students: 48, rating: 4.9 },
              { title: 'Machine Learning with scikit-learn', students: 32, rating: 4.8 },
              { title: 'Web Development with React & Flask', students: 64, rating: 4.7 },
            ].map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl border flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{c.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{c.students} students enrolled • ★ {c.rating}</p>
                </div>
                <Badge variant="success">Published</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Upcoming Live Classes (BBB / Jitsi)</h3>
            <Link to="/teacher/schedule-class" className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>Schedule</Link>
          </div>
          <div className="p-4 rounded-2xl border" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Scheduled on BigBlueButton</span>
            </div>
            <h4 className="font-bold text-base" style={{ color: 'var(--text)' }}>Intro to Python – Live Q&A and Code Lab</h4>
            <p className="text-xs text-muted mt-1">Tomorrow at 4:00 PM (IST) • 60 min session</p>
            <div className="mt-3 flex gap-2">
              <a
                href="https://demo.bigbluebutton.org/gl"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
              >
                <Video size={14} /> Start Room
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
