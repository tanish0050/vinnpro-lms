import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div
        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
      >
        <GraduationCap size={32} className="text-white" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404</h1>
      <h2 className="text-lg font-bold text-muted mt-1">Page Not Found</h2>
      <p className="text-xs text-muted mt-2 max-w-sm leading-relaxed">
        The classroom, curriculum, or resource you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md inline-flex items-center gap-1.5"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
      >
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  )
}
