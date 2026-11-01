import { Card } from '../../components/ui/SharedUI'
import ThemeSwitcher from '../../components/layout/ThemeSwitcher'

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>System Settings & Branding</h1>
        <p className="text-xs text-muted">Customize instance properties, default themes, and AI parameters</p>
      </div>

      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>Appearance & Theme Configuration</h3>
        <p className="text-xs text-muted">Choose your default system theme</p>
        <ThemeSwitcher />
      </Card>

      <Card className="space-y-4">
        <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>AI Tutor & Intelligence Engine</h3>
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1" style={{ color: 'var(--text)' }}>RAG Vector Index Model</label>
            <input
              type="text"
              readOnly
              value="VinnPro Embeddings Core (Permission-Aware Vector Index)"
              className="w-full p-2.5 rounded-xl border text-muted"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1" style={{ color: 'var(--text)' }}>Online Conferencing Driver</label>
            <input
              type="text"
              readOnly
              value="BigBlueButton & Jitsi WebRTC Engine"
              className="w-full p-2.5 rounded-xl border text-muted"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
