import { useNotificationStore } from '../../store/useNotificationStore'
import { Bell, CheckCheck, X, Info } from 'lucide-react'

export default function NotificationPanel() {
  const { notifications, isOpen, togglePanel, markAllRead, markRead } = useNotificationStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl flex flex-col border-l backdrop-blur-md transition-all"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 font-semibold text-lg" style={{ color: 'var(--text)' }}>
          <Bell size={20} style={{ color: 'var(--primary)' }} />
          <span>Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="p-1.5 rounded-lg text-xs flex items-center gap-1 hover:opacity-80 transition"
            style={{ color: 'var(--primary)' }}
            title="Mark all as read"
          >
            <CheckCheck size={16} />
            <span className="hidden sm:inline">Mark read</span>
          </button>
          <button
            onClick={togglePanel}
            className="p-1.5 rounded-lg hover:opacity-80 transition"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted">
            <Bell size={36} className="mx-auto mb-2 opacity-30" />
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markRead(n._id)}
              className={`p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                !n.read ? 'border-primary/50' : 'opacity-70'
              }`}
              style={{
                backgroundColor: !n.read ? 'var(--surface)' : 'transparent',
                borderColor: !n.read ? 'var(--primary)' : 'var(--border)'
              }}
            >
              <div className="flex items-start gap-2.5">
                <Info size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                <div className="flex-1">
                  <h4 className="font-semibold" style={{ color: 'var(--text)' }}>{n.title}</h4>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-muted mt-2 block opacity-60">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
