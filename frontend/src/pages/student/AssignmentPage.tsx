import { useState } from 'react'
import { Card, Badge } from '../../components/ui/SharedUI'
import { FileCode, Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AssignmentPage() {
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitted(true)
    toast.success('Assignment submitted for instructor review!')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Assignment Submission</h1>
        <p className="text-xs text-muted">Section 8.1 Assignments, Rubric Evaluation & Outcome Tracking</p>
      </div>

      <Card className="space-y-4">
        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Python Functions & Algorithms Lab 1</h3>
            <p className="text-xs text-muted mt-0.5">Due: Next Sunday • Max Points: 100</p>
          </div>
          <Badge variant={submitted ? 'success' : 'warning'}>
            {submitted ? 'Submitted' : 'Pending'}
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl border text-xs text-muted leading-relaxed" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <strong className="block text-white mb-1">Instructions:</strong>
          Write a Python program that calculates the nth Fibonacci number using recursion with memoization. Include Big-O complexity analysis and unit test cases. Submit code or GitHub repository link below.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-muted">Your Solution (Code or GitHub Link)</label>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Python source code or GitHub repository URL here..."
              className="w-full p-3 rounded-xl border text-xs font-mono"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            {submitted ? (
              <>
                <CheckCircle2 size={16} /> Submitted Successfully
              </>
            ) : (
              <>
                <Send size={14} /> Submit Solution
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  )
}
