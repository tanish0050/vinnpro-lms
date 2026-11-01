import { useState } from 'react'
import { Card } from '../../components/ui/SharedUI'
import { MessageSquare, ThumbsUp, Plus, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DiscussionForum() {
  const [threads, setThreads] = useState<any[]>([
    {
      id: '1',
      title: 'How does Python garbage collection handle cyclic references?',
      author: 'Rahul Verma',
      content: 'In Python, reference counting handles basic deallocation, but cyclic references require the generational gc module.',
      likes: 12,
      replies: 4
    },
    {
      id: '2',
      title: 'Tips for mastering dynamic programming recursion trees',
      author: 'Dr. Sarah Thompson',
      content: 'Always write down the state transition equation and base conditions first before memoizing.',
      likes: 24,
      replies: 7
    }
  ])
  const [showNew, setShowNew] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    const newThread = {
      id: String(Date.now()),
      title,
      author: 'You (Alex Johnson)',
      content,
      likes: 1,
      replies: 0
    }
    setThreads([newThread, ...threads])
    setTitle('')
    setContent('')
    setShowNew(false)
    toast.success('Discussion thread published!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Peer Discussions & Community</h1>
          <p className="text-xs text-muted">Section 8.1 Discussions, peer review and collaborative problem solving</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          <Plus size={16} />
          <span>New Thread</span>
        </button>
      </div>

      {showNew && (
        <Card className="space-y-3">
          <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Ask a Question or Share Insight</h3>
          <form onSubmit={handlePost} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Topic or question title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <textarea
              required
              rows={3}
              placeholder="Elaborate with code snippet or context..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 rounded-xl border text-xs"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <Send size={14} /> Post Discussion
            </button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {threads.map(t => (
          <Card key={t.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{t.title}</h3>
              <button
                onClick={() => {
                  setThreads(threads.map(x => x.id === t.id ? { ...x, likes: x.likes + 1 } : x))
                  toast.success('Upvoted!')
                }}
                className="flex items-center gap-1 text-xs text-muted hover:text-primary transition"
              >
                <ThumbsUp size={14} />
                <span>{t.likes}</span>
              </button>
            </div>
            <p className="text-xs text-muted leading-relaxed">{t.content}</p>
            <div className="pt-2 border-t flex justify-between text-[11px] text-muted" style={{ borderColor: 'var(--border)' }}>
              <span>Started by <strong className="text-white">{t.author}</strong></span>
              <span className="flex items-center gap-1">
                <MessageSquare size={12} /> {t.replies} replies
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
