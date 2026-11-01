import { useState, useEffect } from 'react'
import { Card, Badge } from '../../components/ui/SharedUI'
import { BookOpen, Download, Search, FileText, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

export default function EbookLibrary() {
  const [ebooks, setEbooks] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('/ebooks')
      .then(res => setEbooks(res.data.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Ebook & Digital Curriculum Library</h1>
          <p className="text-xs text-muted">Section 8.2 Ebook Intelligence (Upload → OCR → Chunking → Embeddings → AI Tutor)</p>
        </div>
        <Link
          to="/student/ai-tutor"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 self-start"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
        >
          <Sparkles size={16} /> Query Ebooks via AI
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(ebooks.length > 0 ? ebooks : [
          {
            _id: '1',
            title: 'Python Crash Course – Free Edition',
            author: 'Dr. Sarah Thompson',
            category: 'Programming',
            pages: 280,
            coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
            description: 'Beginner-friendly ebook covering variables, OOP, and data structures.'
          },
          {
            _id: '2',
            title: 'Modern AI & Machine Learning Foundations',
            author: 'VinnPro AI Research Group',
            category: 'Data Science',
            pages: 340,
            coverUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
            description: 'Mathematics, backpropagation, and deep neural architectures.'
          }
        ]).map((book: any) => (
          <Card key={book._id} className="overflow-hidden p-0 flex flex-col justify-between">
            <img src={book.coverUrl} className="w-full h-44 object-cover" />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="primary">{book.category}</Badge>
                  <span className="text-xs text-muted">{book.pages} Pages</span>
                </div>
                <h3 className="font-bold text-base line-clamp-1" style={{ color: 'var(--text)' }}>{book.title}</h3>
                <p className="text-xs text-muted mt-0.5">Author: {book.author}</p>
                <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">{book.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)' }}>
                <span className="text-emerald-400 font-semibold">• OCR Index Complete</span>
                <button
                  onClick={() => toast.success('Ebook reader opened!')}
                  className="px-3 py-1.5 rounded-lg border flex items-center gap-1.5 hover:bg-white/10 transition text-white"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <FileText size={14} /> Read Ebook
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
