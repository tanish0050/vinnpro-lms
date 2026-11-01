import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, BookOpen, Clock, Filter, TrendingUp, Zap, Lock } from 'lucide-react'
import { Card, Badge } from '../../components/ui/SharedUI'
import axios from '../../api/axios'

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  INTERMEDIATE: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ADVANCED: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
}

const CATEGORIES = ['All', 'Programming', 'Data Science', 'Web Development', 'Computer Science', 'Design']

export default function CourseCatalog() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  useEffect(() => {
    axios.get('/courses')
      .then(res => {
        // Handle both {data: [...]} and {data: {items: [...]}} and plain array
        const raw = res.data
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.data) ? raw.data
          : Array.isArray(raw?.data?.items) ? raw.data.items
          : []
        setCourses(list)
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const matchesSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory
    const matchesFree = !showFreeOnly || c.isFree
    return matchesSearch && matchesCat && matchesFree
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 border relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--card), var(--surface))', borderColor: 'var(--border)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>Course Catalog</span>
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
            Explore {courses.length} Courses
          </h1>
          <p className="text-xs text-muted mt-1">Structured, outcome-driven education pathways for every skill level</p>
        </div>
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: 'var(--primary)' }} />
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by title, topic, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap transition-all ${
              showFreeOnly ? 'text-white border-emerald-500/40 bg-emerald-500/20' : 'border-border text-muted'
            }`}
          >
            <Zap size={14} />
            Free Only
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'border-primary/60 text-white shadow-md'
                  : 'border-border text-muted hover:border-primary/30'
              }`}
              style={selectedCategory === cat ? { background: 'linear-gradient(135deg, var(--primary), var(--secondary))' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Filter size={13} />
        <span>{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-2xl border animate-pulse" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="h-44 rounded-t-2xl bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-white/5 rounded-full w-1/3" />
                <div className="h-4 bg-white/5 rounded-full w-3/4" />
                <div className="h-3 bg-white/5 rounded-full w-full" />
                <div className="h-3 bg-white/5 rounded-full w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
          <BookOpen size={40} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text)' }} />
          <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>No courses found</h3>
          <p className="text-xs text-muted mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <Link to={`/student/course/${c._id}`} key={c._id} className="group">
              <Card className="h-full overflow-hidden p-0 flex flex-col group-hover:border-primary/50 transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={c.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' }}
                  />
                  {/* Level badge overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[c.level] || LEVEL_COLOR.BEGINNER}`}>
                      {c.level || 'BEGINNER'}
                    </span>
                  </div>
                  {/* Free/Price overlay */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${c.isFree ? 'bg-emerald-500 text-white' : 'bg-black/60 text-white border border-white/20'}`}>
                      {c.isFree ? 'FREE' : `₹${c.price}`}
                    </span>
                  </div>
                  {!c.isFree && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2">
                        <Lock size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Badge variant="primary" className="mb-2">{c.category || 'General'}</Badge>
                    <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mt-1" style={{ color: 'var(--text)' }}>
                      {c.title}
                    </h3>
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Tags */}
                    {c.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{c.rating || '4.8'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={13} />
                      <span>{c.studentsCount || 0} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>Self-paced</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
