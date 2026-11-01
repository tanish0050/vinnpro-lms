import { useState, useEffect } from 'react'
import { Card, Badge } from '../../components/ui/SharedUI'
import { Video, Calendar, Clock, User, ExternalLink } from 'lucide-react'
import axios from '../../api/axios'

export default function LiveClasses() {
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    axios.get('/live-classes')
      .then(res => setClasses(res.data.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Online Classes & Live Webinars</h1>
        <p className="text-xs text-muted">Section 8.4 WebRTC interactive classroom (BigBlueButton & Jitsi)</p>
      </div>

      <div className="space-y-4">
        {classes.length === 0 ? (
          <Card className="text-center py-12 text-muted">
            <Video size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No live webinars scheduled currently.</p>
          </Card>
        ) : (
          classes.map(c => (
            <Card key={c._id} className="space-y-4 hover:border-primary/40 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary">{c.platform || 'BigBlueButton'}</Badge>
                    <span className="text-xs text-emerald-400 font-semibold">• Live Stream Ready</span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{c.title}</h3>
                </div>
                <a
                  href={c.meetingUrl || 'https://demo.bigbluebutton.org/gl'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md inline-flex items-center gap-1.5 self-start sm:self-auto"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                >
                  <Video size={16} /> Join Class
                  <ExternalLink size={12} />
                </a>
              </div>

              <p className="text-xs text-muted leading-relaxed">{c.description}</p>

              <div className="flex flex-wrap gap-4 text-xs text-muted pt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {new Date(c.scheduledAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {c.duration} mins
                </span>
                <span className="flex items-center gap-1">
                  <User size={14} /> Instructor Session
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
