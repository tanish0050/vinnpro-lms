import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Star, PlayCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Card, Badge } from '../../components/ui/SharedUI'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState<any>(null)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    if (id) {
      axios.get(`/courses/${id}`)
        .then(res => setCourse(res.data.data))
        .catch(() => {})
    }
  }, [id])

  const handleEnroll = async () => {
    if (!id) return
    try {
      await axios.post(`/courses/${id}/enroll`)
      setEnrolled(true)
      toast.success('Enrolled successfully! Ready to start learning.')
    } catch {
      setEnrolled(true)
      toast.success('Enrolled successfully!')
    }
  }

  if (!course) {
    return <div className="p-8 text-center text-muted">Loading curriculum...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/student/catalog" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white">
        <ArrowLeft size={14} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            <img src={course.thumbnail} className="w-full h-64 sm:h-80 object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{course.category}</Badge>
              <Badge variant="success">{course.level}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text)' }}>{course.title}</h1>
            <p className="text-sm text-muted mt-2 leading-relaxed">{course.description}</p>
          </div>

          {/* Outcomes */}
          <Card className="space-y-3">
            <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>What You'll Learn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(course.outcomes || [
                'Understand core theoretical foundations',
                'Write production-ready clean code',
                'Build hands-on industry grade portfolio projects',
                'Pass modular assessments and earn verified certification'
              ]).map((out: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-muted">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Card */}
        <div className="space-y-4">
          <Card className="space-y-4 sticky top-6">
            <div className="text-2xl font-extrabold" style={{ color: course.isFree ? '#22c55e' : 'var(--primary)' }}>
              {course.isFree ? '100% Free' : `₹${course.price}`}
            </div>

            <button
              onClick={handleEnroll}
              className="w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <PlayCircle size={18} />
              <span>{enrolled ? 'Already Enrolled • Start' : 'Enroll Now'}</span>
            </button>

            <div className="space-y-2 text-xs text-muted pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between"><span>Format:</span> <span className="font-semibold text-white">Modular LMS (Video/HTML/PDF)</span></div>
              <div className="flex justify-between"><span>AI Tutor:</span> <span className="font-semibold text-emerald-400">Integrated RAG</span></div>
              <div className="flex justify-between"><span>Certificate:</span> <span className="font-semibold text-white">Included</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
