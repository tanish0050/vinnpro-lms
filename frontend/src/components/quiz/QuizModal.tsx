import { useState } from 'react'
import { CheckCircle2, XCircle, Trophy, RotateCcw, X, Clock, Brain, ArrowRight, Star } from 'lucide-react'

// ── Quiz data: 5 MCQs per subject ─────────────────────────────────────────────
export const QUIZ_DATA: Record<string, { title: string; subject: string; color: string; questions: { text: string; options: string[]; answer: string; explanation: string }[] }> = {
  python: {
    title: 'Python Basics Quiz',
    subject: 'Python',
    color: '#6366f1',
    questions: [
      {
        text: 'What keyword is used to define a function in Python?',
        options: ['function', 'def', 'fun', 'define'],
        answer: 'def',
        explanation: '"def" is the keyword used to define a function in Python. Example: def my_function():'
      },
      {
        text: 'Which data type is MUTABLE in Python?',
        options: ['tuple', 'string', 'list', 'int'],
        answer: 'list',
        explanation: 'Lists are mutable - you can change, add, or remove elements. Tuples and strings are immutable.'
      },
      {
        text: 'What does len("Hello") return?',
        options: ['4', '5', '6', 'Error'],
        answer: '5',
        explanation: 'len() returns the number of characters. "Hello" has 5 characters: H-e-l-l-o.'
      },
      {
        text: 'Which symbol is used for single-line comments in Python?',
        options: ['//', '/* */', '#', '--'],
        answer: '#',
        explanation: 'In Python, # is used for single-line comments. Everything after # on a line is ignored by the interpreter.'
      },
      {
        text: 'What is the output of: print(2 ** 3)?',
        options: ['6', '8', '9', '5'],
        answer: '8',
        explanation: '** is the exponentiation operator. 2 ** 3 = 2 × 2 × 2 = 8.'
      },
    ]
  },
  javascript: {
    title: 'JavaScript ES6 Quiz',
    subject: 'JavaScript',
    color: '#f59e0b',
    questions: [
      {
        text: 'Which keyword declares a variable that CANNOT be reassigned?',
        options: ['var', 'let', 'const', 'static'],
        answer: 'const',
        explanation: '"const" declares a constant - once assigned, the variable cannot be reassigned. However, object properties can still be modified.'
      },
      {
        text: 'What does === check in JavaScript?',
        options: ['Value only', 'Type only', 'Value AND type', 'Reference'],
        answer: 'Value AND type',
        explanation: '=== is the strict equality operator. It checks both value and type. 5 === "5" is false because types differ.'
      },
      {
        text: 'What is the output of: typeof null?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        answer: '"object"',
        explanation: 'typeof null returns "object" - this is a known JavaScript bug that has been kept for backward compatibility.'
      },
      {
        text: 'Which array method creates a NEW array with filtered elements?',
        options: ['forEach()', 'map()', 'filter()', 'reduce()'],
        answer: 'filter()',
        explanation: 'filter() creates a new array with all elements that pass the test function. It does not modify the original array.'
      },
      {
        text: 'What does "async/await" handle in JavaScript?',
        options: ['CSS animations', 'Asynchronous operations', 'Event listeners', 'DOM manipulation'],
        answer: 'Asynchronous operations',
        explanation: 'async/await is syntactic sugar over Promises, making asynchronous code look and behave like synchronous code.'
      },
    ]
  },
  dsa: {
    title: 'DSA Fundamentals Quiz',
    subject: 'DSA',
    color: '#ef4444',
    questions: [
      {
        text: 'What is the time complexity of Binary Search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        answer: 'O(log n)',
        explanation: 'Binary Search divides the search space in half at each step, resulting in O(log n) time complexity.'
      },
      {
        text: 'Which data structure uses LIFO (Last In, First Out)?',
        options: ['Queue', 'Stack', 'Linked List', 'Heap'],
        answer: 'Stack',
        explanation: 'A Stack follows LIFO - the last element added is the first to be removed. Think of a stack of plates.'
      },
      {
        text: 'What is the worst-case time complexity of Bubble Sort?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
        answer: 'O(n²)',
        explanation: 'Bubble Sort compares adjacent elements and swaps them, resulting in O(n²) worst-case when the array is reverse sorted.'
      },
      {
        text: 'In a Binary Search Tree, where is the smallest element?',
        options: ['Root', 'Rightmost node', 'Leftmost node', 'Random position'],
        answer: 'Leftmost node',
        explanation: 'In a BST, all left children are smaller than the parent. So the leftmost node (minimum depth leaf) is always the smallest.'
      },
      {
        text: 'Which traversal visits nodes in Left → Root → Right order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
        answer: 'Inorder',
        explanation: 'Inorder traversal: Left → Root → Right. For a BST, inorder traversal gives elements in sorted (ascending) order.'
      },
    ]
  }
}

// ── Quiz Modal Component ───────────────────────────────────────────────────────
interface QuizModalProps {
  quizKey: string
  onClose: () => void
}

export default function QuizModal({ quizKey, onClose }: QuizModalProps) {
  const quiz = QUIZ_DATA[quizKey]
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([])
  const [finished, setFinished] = useState(false)

  if (!quiz) return null

  const q = quiz.questions[currentQ]
  const total = quiz.questions.length
  const score = answers.filter(a => a.correct).length

  const handleSelect = (opt: string) => {
    if (answered) return
    setSelected(opt)
    const isCorrect = opt === q.answer
    setAnswers(prev => [...prev, { selected: opt, correct: isCorrect }])
    setAnswered(true)
  }

  const handleNext = () => {
    if (currentQ + 1 >= total) {
      setFinished(true)
    } else {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const handleRetake = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(false)
    setAnswers([])
    setFinished(false)
  }

  const pct = Math.round((score / total) * 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Color accent top bar */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${quiz.color}, ${quiz.color}88)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Brain size={18} style={{ color: quiz.color }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: quiz.color }}>{quiz.subject}</span>
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{quiz.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-white hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6">
          {!finished ? (
            <>
              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-muted mb-1.5">
                  <span>Question {currentQ + 1} of {total}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    Untimed
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentQ) / total) * 100}%`, backgroundColor: quiz.color }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-5 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text)' }}>
                  Q{currentQ + 1}. {q.text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {q.options.map((opt, i) => {
                  const isSelected = selected === opt
                  const isCorrect = answered && opt === q.answer
                  const isWrong = answered && isSelected && opt !== q.answer
                  const isUnselected = answered && !isSelected && opt !== q.answer

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      disabled={answered}
                      className={`w-full p-3.5 rounded-2xl border text-sm font-medium text-left transition-all flex items-center justify-between gap-3 ${
                        answered ? 'cursor-default' : 'hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                      }`}
                      style={{
                        borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isSelected ? quiz.color : 'var(--border)',
                        backgroundColor: isCorrect ? 'rgba(34,197,94,0.12)' : isWrong ? 'rgba(239,68,68,0.12)' : isSelected && !answered ? `${quiz.color}22` : 'var(--surface)',
                        color: isUnselected && answered ? 'var(--text-muted)' : 'var(--text)',
                        opacity: isUnselected ? 0.5 : 1,
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'var(--border)',
                            backgroundColor: isCorrect ? 'rgba(34,197,94,0.2)' : isWrong ? 'rgba(239,68,68,0.2)' : 'var(--card)',
                            color: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'var(--text)',
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>
                      {isCorrect && <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />}
                      {isWrong && <XCircle size={18} className="text-rose-400 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {/* Explanation (after answering) */}
              {answered && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed mb-5 ${
                    selected === q.answer
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {selected === q.answer
                      ? <><CheckCircle2 size={14} className="text-emerald-400" /> Correct! Well done!</>
                      : <><XCircle size={14} className="text-rose-400" /> Incorrect — Correct answer: <span className="font-extrabold">{q.answer}</span></>
                    }
                  </div>
                  <p style={{ color: 'inherit', opacity: 0.9 }}>{q.explanation}</p>
                </div>
              )}

              {/* Next button */}
              {answered && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color}99)` }}
                >
                  {currentQ + 1 >= total ? (
                    <><Trophy size={16} /> See Results</>
                  ) : (
                    <>Next Question <ArrowRight size={16} /></>
                  )}
                </button>
              )}
            </>
          ) : (
            /* ── RESULTS SCREEN ── */
            <div className="text-center py-4">
              <div className="relative inline-block mb-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center border-4 mx-auto"
                  style={{
                    borderColor: pct >= 80 ? '#22c55e' : pct >= 60 ? quiz.color : '#ef4444',
                    background: pct >= 80 ? 'rgba(34,197,94,0.1)' : pct >= 60 ? `${quiz.color}22` : 'rgba(239,68,68,0.1)'
                  }}
                >
                  <Trophy size={36} className={pct >= 60 ? 'text-amber-400' : 'text-muted'} />
                </div>
              </div>

              <h3 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>
                {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!'}
              </h3>

              <div className="text-5xl font-black my-3" style={{ color: pct >= 80 ? '#22c55e' : pct >= 60 ? quiz.color : '#ef4444' }}>
                {pct}%
              </div>

              <p className="text-sm text-muted mb-2">
                You got <span className="font-bold" style={{ color: 'var(--text)' }}>{score}</span> out of <span className="font-bold" style={{ color: 'var(--text)' }}>{total}</span> correct
              </p>

              {/* Per-question breakdown */}
              <div className="grid grid-cols-5 gap-2 my-5">
                {answers.map((a, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border"
                      style={{
                        backgroundColor: a.correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        borderColor: a.correct ? '#22c55e' : '#ef4444',
                        color: a.correct ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {a.correct ? '✓' : '✗'}
                    </div>
                    <span className="text-[10px] text-muted">Q{i + 1}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--surface)' }}
                >
                  <RotateCcw size={15} /> Retake
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color}99)` }}
                >
                  <Star size={15} /> Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
