import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/SharedUI'
import { Trophy, Medal, Flame } from 'lucide-react'
import axios from '../../api/axios'

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    axios.get('/leaderboard')
      .then(res => setLeaders(res.data.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-1">
        <Trophy size={40} className="mx-auto text-amber-400" />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Global Learner Leaderboard</h1>
        <p className="text-xs text-muted">Weekly rankings based on active study sessions, quizzes, and outcomes</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {leaders.map((student, idx) => (
            <div
              key={idx}
              className={`p-4 flex items-center justify-between transition ${
                student.isCurrent ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-bold text-sm">
                  {idx === 0 ? <Medal size={22} className="text-amber-400 mx-auto" /> :
                   idx === 1 ? <Medal size={22} className="text-slate-300 mx-auto" /> :
                   idx === 2 ? <Medal size={22} className="text-amber-600 mx-auto" /> :
                   `#${idx + 1}`}
                </div>
                <img src={student.avatar} className="w-9 h-9 rounded-full border border-white/10" />
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                    {student.name} {student.isCurrent && '(You)'}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Flame size={12} className="fill-amber-400" /> {student.streak}d streak
                    </span>
                    <span>• {student.coursesCompleted} courses</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-sm" style={{ color: 'var(--primary)' }}>
                  {student.xp} XP
                </div>
                <div className="text-[10px] text-muted">Points</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
