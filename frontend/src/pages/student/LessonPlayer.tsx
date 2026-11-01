import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PlayCircle, CheckCircle, FileText, ArrowLeft, ArrowRight, Sparkles, MessageSquare } from 'lucide-react'
import { Card, ProgressBar } from '../../components/ui/SharedUI'
import toast from 'react-hot-toast'

export default function LessonPlayer() {
  const [activeLesson, setActiveLesson] = useState(0)
  const [completed, setCompleted] = useState<number[]>([0])
  const [idleAlert, setIdleAlert] = useState(false)

  const lessons = [
    { title: '1. Introduction & Environment Setup', type: 'VIDEO', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 15 },
    { title: '2. Variables, Expressions & Types', type: 'HTML', content: '<h2>Variables in Python</h2><p>Python is dynamically typed. Memory allocation happens at runtime.</p><pre><code>name = "VinnPro"\nx = 42\nprint(f"Hello {name}, value: {x}")</code></pre>', duration: 20 },
    { title: '3. Control Flow: Conditions & Loops', type: 'VIDEO', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 18 },
    { title: '4. Functions and Modular Structure', type: 'HTML', content: '<h2>Functions</h2><p>Defined using <code>def</code> keyword with optional type annotations.</p>', duration: 25 },
    { title: '5. Assessment: Modular Quiz 1', type: 'QUIZ', quizId: 'quiz1', duration: 10 }
  ]

  const markComplete = (idx: number) => {
    if (!completed.includes(idx)) {
      setCompleted([...completed, idx])
      toast.success('Lesson marked complete! +25 XP earned 🔥')
    }
  }

  const current = lessons[activeLesson]

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/student" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="text-xs text-muted">
          Progress: <strong className="text-primary">{Math.round((completed.length / lessons.length) * 100)}%</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden border bg-black shadow-xl aspect-video flex items-center justify-center relative" style={{ borderColor: 'var(--border)' }}>
            {current.type === 'VIDEO' ? (
              <iframe
                src={current.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : current.type === 'QUIZ' ? (
              <div className="p-8 text-center space-y-4">
                <h3 className="text-xl font-bold text-white">Modular Knowledge Check</h3>
                <p className="text-xs text-muted">Section 8.1 Assessment Structure</p>
                <Link
                  to="/student/quiz/quiz1"
                  className="inline-block px-6 py-2.5 rounded-xl font-bold text-xs text-white"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                >
                  Start Assessment Now
                </Link>
              </div>
            ) : (
              <div className="p-6 bg-surface w-full h-full overflow-y-auto text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: current.content || '' }} />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{current.title}</h2>
              <p className="text-xs text-muted mt-0.5">Estimated Duration: {current.duration} minutes</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => markComplete(activeLesson)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  completed.includes(activeLesson) ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-primary text-primary'
                }`}
              >
                {completed.includes(activeLesson) ? '✓ Completed' : 'Mark as Completed'}
              </button>
              {activeLesson < lessons.length - 1 && (
                <button
                  onClick={() => setActiveLesson(activeLesson + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Lessons List */}
        <Card className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Curriculum Lessons</h3>
            <span className="text-xs text-muted">{completed.length}/{lessons.length}</span>
          </div>

          <div className="space-y-2">
            {lessons.map((les, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLesson(idx)}
                className={`w-full p-3 rounded-xl text-left text-xs border transition flex items-center justify-between ${
                  activeLesson === idx ? 'border-primary bg-primary/10' : 'border-border hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {completed.includes(idx) ? (
                    <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <PlayCircle size={16} className="text-muted shrink-0" />
                  )}
                  <span className={`font-medium line-clamp-1 ${activeLesson === idx ? 'text-white' : 'text-muted'}`}>
                    {les.title}
                  </span>
                </div>
                <span className="text-[10px] text-muted shrink-0">{les.duration}m</span>
              </button>
            ))}
          </div>

          {/* AI Helper Banner */}
          <div className="p-3.5 rounded-xl border border-dashed mt-4 text-xs" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: 'var(--primary)' }}>
              <Sparkles size={14} />
              <span>AI Tutor Live on this Lesson</span>
            </div>
            <p className="text-muted text-[11px] leading-relaxed">
              Have questions about this topic? Ask the AI Tutor to generate analogies or code examples.
            </p>
            <Link to="/student/ai-tutor" className="mt-2 block font-bold text-[11px] underline" style={{ color: 'var(--primary)' }}>
              Launch Question Chat →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
