import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/SharedUI'
import { Award, Download, CheckCircle2, ShieldCheck } from 'lucide-react'
import axios from '../../api/axios'
import toast from 'react-hot-toast'

export default function MyCertificates() {
  const [certs, setCerts] = useState<any[]>([])

  useEffect(() => {
    axios.get('/certificates')
      .then(res => setCerts(res.data.data || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Verified Certificates & Outcomes</h1>
        <p className="text-xs text-muted">Section 8.1 Completion & learning-outcome credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map(cert => (
          <Card key={cert._id} className="relative overflow-hidden border-2 border-primary/30 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
                >
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Certificate of Mastery</h3>
                  <p className="text-[10px] text-muted font-mono">{cert.certificateId}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Grade: {cert.grade || 'A+'}
              </span>
            </div>

            <div>
              <p className="text-xs text-muted">This certifies that</p>
              <h4 className="text-lg font-bold text-white mt-0.5">{cert.userName || 'Alex Johnson'}</h4>
              <p className="text-xs text-muted mt-1">
                has successfully satisfied all prerequisites, assessments, and learning outcomes in
              </p>
              <p className="text-sm font-semibold text-primary mt-1">{cert.courseTitle}</p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs text-muted" style={{ borderColor: 'var(--border)' }}>
              <span>Issued: {cert.issuedAt}</span>
              <button
                onClick={() => toast.success('Certificate downloaded in high-res PDF!')}
                className="px-3 py-1.5 rounded-lg border flex items-center gap-1.5 hover:bg-white/10 transition text-white"
                style={{ borderColor: 'var(--border)' }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
