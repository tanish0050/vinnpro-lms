import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Badge } from '../../components/ui/SharedUI'
import { HelpCircle, CheckCircle, XCircle, ArrowLeft, Trophy, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function QuizPage() {
  const navigate = useNavigate()
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const questions = [
    {
      text: 'What keyword is used to define a function in Python?',
      options: ['function', 'def', 'fun', 'define'],
      answer: 'def'
    },
    {
      text: 'Python is a statically-typed language.',
      options: ['True', 'False'],
      answer: 'False'
    },
    {
      text: 'Which method is used to add an element to the end of a list?',
      options: ['add()', 'push()', 'append()', 'insert()'],
      answer: 'append()'
    }
  ]

  const handleSelect = (qIdx: number, opt: string) => {
    if (submitted) return
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: opt })
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) correct++
    })
    const percentage = Math.round((correct / questions.length) * 100)
    setScore(percentage)
    setSubmitted(true)
    if (percentage >= 70) {
      toast.success(`Passed! You scored ${percentage}% 🎉`)
    } else {
      toast.error(`Score: ${percentage}%. Review and try again!`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white">
        <ArrowLeft size={14} /> Back to Course
      </button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Modular Assessment: Python Basics</h1>
          <p className="text-xs text-muted">Passing threshold: 70% • Instant grading & feedback</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--border)' }}>
          <Clock size={14} className="text-primary" />
          <span>Untimed practice</span>
        </div>
      </div>

      {submitted && (
        <Card className="text-center p-6 border-emerald-500/40 bg-emerald-500/10">
          <Trophy size={40} className="mx-auto text-amber-400 mb-2" />
          <h2 className="text-xl font-bold text-white">Quiz Completed!</h2>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{score}%</p>
          <p className="text-xs text-muted mt-2">
            {score >= 70 ? 'Congratulations, you satisfied learning outcome mastery.' : 'Keep practicing to master this module.'}
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <Card key={qIdx} className="space-y-3">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
              {qIdx + 1}. {q.text}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[qIdx] === opt
                const isCorrect = submitted && opt === q.answer
                const isWrong = submitted && isSelected && opt !== q.answer

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, opt)}
                    className={`p-3 rounded-xl text-xs font-medium text-left border transition flex items-center justify-between ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : isWrong
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : isSelected
                        ? 'border-primary bg-primary/20 text-white'
                        : 'border-border text-muted hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle size={16} className="text-emerald-400" />}
                    {isWrong && <XCircle size={16} className="text-rose-400" />}
                  </button>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < questions.length}
          className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          Submit Quiz Answers
        </button>
      ) : (
        <button
          onClick={() => { setSubmitted(false); setSelectedAnswers({}) }}
          className="w-full py-3 rounded-xl font-bold text-sm border"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          Retake Assessment
        </button>
      )}
    </div>
  )
}
