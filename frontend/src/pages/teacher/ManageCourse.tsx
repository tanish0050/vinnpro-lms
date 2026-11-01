import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Badge } from '../../components/ui/SharedUI'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import axios from '../../api/axios'

export default function ManageCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    if (id) {
      axios.get(`/courses/${id}`).then(res => setCourse(res.data.data)).catch(() => {})
    }
  }, [id])

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted hover:text-white">
        <ArrowLeft size={14} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Manage Curriculum Structure</h1>
        <p className="text-xs text-muted">Course → Module → Lesson → Activity → Assessment</p>
      </div>

      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Modules & Lessons</h3>
        <p className="text-xs text-muted">Interactive curriculum editor with SCORM standard compliance.</p>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Module 1: Foundations & Setup</span>
            <Badge variant="primary">3 Lessons</Badge>
          </div>
          <ul className="text-xs space-y-1.5 text-muted list-disc list-inside">
            <li>1.1 Environment Setup (Video)</li>
            <li>1.2 Variables & Syntax (Interactive HTML)</li>
            <li>1.3 Module 1 Quiz (Assessment)</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
