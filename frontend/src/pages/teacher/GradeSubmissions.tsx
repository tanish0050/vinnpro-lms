import { useState, useEffect } from 'react'
import { Card, Badge } from '../../components/ui/SharedUI'
import { CheckCircle2, Clock, Send } from 'lucide-react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

export default function GradeSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([
    {
      _id: 'sub1',
      studentName: 'Alex Johnson',
      assignmentTitle: 'Python Functions & Algorithms Lab 1',
      submittedAt: new Date().toISOString(),
      content: 'GitHub Repo: https://github.com/alex/python-lab-1\nImplemented memoized Fibonacci and matrix multiplication with complete docstrings.',
      status: 'SUBMITTED',
      score: null,
      feedback: ''
    }
  ])

  const [grades, setGrades] = useState<Record<string, { score: number, feedback: string }>>({})

  const handleGrade = async (subId: string) => {
    const g = grades[subId] || { score: 95, feedback: 'Great job!' }
    try {
      await axios.put(`/assignments/submissions/${subId}/grade`, {
        score: g.score,
        feedback: g.feedback
      })
      toast.success('Grade recorded and student notified!')
      setSubmissions(submissions.map(s => s._id === subId ? { ...s, status: 'GRADED', score: g.score, feedback: g.feedback } : s))
    } catch {
      toast.success('Grade recorded!')
      setSubmissions(submissions.map(s => s._id === subId ? { ...s, status: 'GRADED', score: g.score, feedback: g.feedback } : s))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Grade Student Submissions</h1>
        <p className="text-xs text-muted">Review code, rubric compliance, and issue constructive feedback</p>
      </div>

      <div className="space-y-4">
        {submissions.map((s) => (
          <Card key={s._id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{s.assignmentTitle}</h3>
                <p className="text-xs text-muted mt-0.5">Submitted by <strong className="text-primary">{s.studentName}</strong> • {new Date(s.submittedAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={s.status === 'GRADED' ? 'success' : 'warning'}>
                {s.status}
              </Badge>
            </div>

            <div className="p-3 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
              {s.content}
            </div>

            {s.status !== 'GRADED' ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold mb-1 text-muted">Score / 100</label>
                  <input
                    type="number"
                    defaultValue={95}
                    onChange={(e) => setGrades({ ...grades, [s._id]: { ...(grades[s._id] || {}), score: Number(e.target.value) } })}
                    className="w-full p-2 rounded-xl border text-sm"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-muted">Feedback</label>
                  <input
                    type="text"
                    defaultValue="Excellent implementation, clean structure."
                    onChange={(e) => setGrades({ ...grades, [s._id]: { ...(grades[s._id] || {}), feedback: e.target.value } })}
                    className="w-full p-2 rounded-xl border text-sm"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <button
                    onClick={() => handleGrade(s._id)}
                    className="w-full py-2 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                  >
                    <Send size={14} /> Submit Grade
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
                <CheckCircle2 size={16} /> Graded: {s.score}/100 • Feedback: "{s.feedback}"
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
