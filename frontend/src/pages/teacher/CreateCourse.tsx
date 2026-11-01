import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import { Card } from '../../components/ui/SharedUI'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

export default function CreateCourse() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('BEGINNER')
  const [price, setPrice] = useState(0)
  const [isFree, setIsFree] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/courses', {
        title,
        description,
        category,
        level,
        price: isFree ? 0 : Number(price),
        isFree,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
      })
      toast.success('Course created successfully!')
      navigate('/teacher')
    } catch {
      toast.error('Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted hover:text-white">
        <ArrowLeft size={14} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Create New Course</h1>
        <p className="text-xs text-muted">Section 8.1 LMS Modular Curriculum Builder</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Course Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Artificial Intelligence with Python"
              className="w-full p-2.5 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of syllabus, prerequisites, and learning outcomes..."
              className="w-full p-2.5 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isFree"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="isFree" className="text-xs font-medium cursor-pointer" style={{ color: 'var(--text)' }}>
              Make this course completely free for students
            </label>
          </div>

          {!isFree && (
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>Price (INR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 mt-4"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
          >
            <Plus size={16} />
            <span>{loading ? 'Publishing...' : 'Create & Publish Course'}</span>
          </button>
        </form>
      </Card>
    </div>
  )
}
