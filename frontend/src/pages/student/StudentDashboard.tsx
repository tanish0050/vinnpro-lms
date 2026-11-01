import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Flame, Trophy, Award, Sparkles, Play, ArrowRight,
  Video, Radio, ExternalLink, Clock, Brain, CheckCircle2, Star
} from 'lucide-react'
import { Card, StatCard, ProgressBar, Badge } from '../../components/ui/SharedUI'
import { useAuthStore } from '../../store/useAuthStore'
import axios from '../../api/axios'
import QuizModal from '../../components/quiz/QuizModal'

// ── Demo quiz data shown on dashboard ─────────────────────────────────────────
const QUICK_QUIZZES = [
  {
    id: 'python',
    subject: 'Python Basics',
    title: 'Variables & Data Types',
    questions: 5,
    time: '5 min',
    difficulty: 'Easy',
    color: '#6366f1',
  },
  {
    id: 'javascript',
    subject: 'JavaScript',
    title: 'ES6 Features Quiz',
    questions: 5,
    time: '5 min',
    difficulty: 'Medium',
    color: '#f59e0b',
  },
  {
    id: 'dsa',
    subject: 'DSA',
    title: 'Arrays & Strings',
    questions: 5,
    time: '8 min',
    difficulty: 'Hard',
    color: '#ef4444',
  },
]


const DIFF_COLOR: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
}

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [data, setData] = useState<any>({
    enrolledCourses: [],
    enrolledCount: 1,
    completedCount: 0,
    averageProgress: 35,
    averageQuizScore: 80,
    studyStreakDays: 4,
    xp: 320,
  })
  const [liveMeetings, setLiveMeetings] = useState<any[]>([])
  const [dismissedMeetings, setDismissedMeetings] = useState<Set<string>>(new Set())
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)

  useEffect(() => {
    // Fetch dashboard data
    axios.get('/students/dashboard')
      .then(res => setData(res.data.data || res.data))
      .catch(() => {})

    // Poll for live meetings every 30 seconds
    const fetchLive = () => {
      axios.get('/live-classes/active')
        .then(res => {
          const raw = res.data
          const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : []
          setLiveMeetings(list)
        })
        .catch(() => {})
    }
    fetchLive()
    const interval = setInterval(fetchLive, 30000)
    return () => clearInterval(interval)
  }, [])

  const visibleMeetings = liveMeetings.filter(m => !dismissedMeetings.has(m._id))

  return (
    <>
    <div className="space-y-6">

      {/* ── LIVE MEETING BANNER ──────────────────────────────────────────────── */}
      {visibleMeetings.map(meeting => (
        <div
          key={meeting._id}
          className="rounded-2xl border p-4 relative overflow-hidden animate-pulse-border"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
            borderColor: 'rgba(239,68,68,0.5)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                  <Radio size={20} className="text-rose-400" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Live Now</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">LIVE</span>
                </div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{meeting.title}</h3>
                {meeting.description && (
                  <p className="text-xs text-muted">{meeting.description}</p>
                )}
                <div className="flex gap-3 text-xs text-muted mt-0.5">
                  <span className="flex items-center gap-1"><Clock size={11} />{meeting.duration} mins</span>
                  <span className="font-medium text-rose-400">{meeting.platform}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={meeting.meetingUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
              >
                <Video size={14} />
                Join Class
                <ExternalLink size={11} />
              </a>
              <button
                onClick={() => setDismissedMeetings(prev => new Set([...prev, meeting._id]))}
                className="px-3 py-2 rounded-xl text-xs font-medium text-muted border hover:text-white transition"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ── WELCOME BANNER ──────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden border shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--card), var(--surface))',
          borderColor: 'var(--border)',
        }}
      >
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 mb-3">
            <Flame size={14} className="fill-amber-400" />
            <span>{data.studyStreakDays} Day Study Streak</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            Ready to continue learning? Your AI Tutor has indexed new curriculum notes for your courses.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/student/catalog"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <BookOpen size={16} />
              <span>Explore Courses</span>
            </Link>
            <Link
              to="/student/ai-tutor"
              className="px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--card)' }}
            >
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <span>Ask AI Tutor</span>
            </Link>
            <Link
              to="/student/live-classes"
              className="px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--card)' }}
            >
              <Video size={16} className="text-rose-400" />
              <span>Live Classes</span>
            </Link>
          </div>
        </div>

        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: 'var(--primary)' }}
        />
      </div>

      {/* ── 4 STAT CARDS ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Enrolled Courses" value={data.enrolledCount} icon={<BookOpen size={20} />} />
        <StatCard title="Study Streak" value={`${data.studyStreakDays} Days`} icon={<Flame size={20} />} trend="Active" />
        <StatCard title="Average Quiz Score" value={`${data.averageQuizScore}%`} icon={<Trophy size={20} />} trend="Passed" />
        <StatCard title="Learning XP" value={`${data.xp} XP`} icon={<Award size={20} />} trend="Top 15%" />
      </div>

      {/* ── QUICK QUIZ SECTION ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Quick Quizzes</h2>
            <p className="text-xs text-muted">Test your knowledge — take a quick quiz!</p>
          </div>
          <Link to="/student/progress" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            <span>My Scores</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_QUIZZES.map(quiz => (
            <Card key={quiz.id} className="group hover:border-primary/50 transition-all duration-300 relative overflow-hidden cursor-pointer"
              onClick={() => setActiveQuiz(quiz.id)}>
              {/* Color accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: quiz.color }} />

              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary">{quiz.subject}</Badge>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFF_COLOR[quiz.difficulty]}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="font-bold text-sm mt-2" style={{ color: 'var(--text)' }}>{quiz.title}</h3>

                <div className="flex gap-3 text-xs text-muted mt-2">
                  <span className="flex items-center gap-1">
                    <Brain size={12} />
                    {quiz.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {quiz.time}
                  </span>
                </div>

                <button
                  className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 group-hover:shadow-lg transition-all"
                  style={{ background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color}bb)` }}
                >
                  <Play size={12} className="fill-white" />
                  Start Quiz
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── CONTINUE LEARNING ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Continue Learning</h2>
          <Link to="/student/catalog" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:border-primary/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="primary">Programming</Badge>
                <span className="text-xs text-muted">Lesson 2 of 6</span>
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>
                Python for Beginners: Zero to Hero
              </h3>
              <p className="text-xs text-muted mt-1">Variables, data structures, and conditional logic.</p>

              {/* Mini achievements */}
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--surface)' }}>
                  <CheckCircle2 size={10} className="text-emerald-400" /> Lesson 1 Done
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--surface)' }}>
                  <Star size={10} className="text-amber-400 fill-amber-400" /> Quiz Passed
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <ProgressBar progress={35} />
              <Link
                to="/student/lesson/python-1"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
              >
                <Play size={14} className="fill-white" />
                <span>Resume Lesson</span>
              </Link>
            </div>
          </Card>

          {/* AI Tutor Card */}
          <Card className="flex flex-col justify-between border-dashed">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">RAG AI Tutor</span>
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>
                Have a doubt in your coursework?
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                The AI tutor answers directly from institution-approved curriculum, ebooks, and faculty notes.
              </p>
            </div>

            <div className="mt-5">
              <Link
                to="/student/ai-tutor"
                className="w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2"
                style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--surface)' }}
              >
                <span>Open AI Curriculum Tutor</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>

    {/* Quiz Modal */}
    {activeQuiz && <QuizModal quizKey={activeQuiz} onClose={() => setActiveQuiz(null)} />}
    </>
  )
}
