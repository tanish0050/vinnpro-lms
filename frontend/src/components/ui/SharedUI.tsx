export function Badge({
  children,
  variant = 'default',
  className = ''
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
  className?: string
}) {
  const styles = {
    default: 'bg-white/10 text-muted border-white/10',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function Card({
  children,
  className = '',
  onClick
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 transition-all shadow-sm ${className}`}
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      {children}
    </div>
  )
}

export function ProgressBar({
  progress = 0,
  showLabel = true,
  height = 'h-2'
}: {
  progress?: number
  showLabel?: boolean
  height?: string
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)))
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs font-medium mb-1" style={{ color: 'var(--text)' }}>
          <span>Completion</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))'
          }}
        />
      </div>
    </div>
  )
}

export function StatCard({
  title,
  value,
  icon,
  trend
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}) {
  return (
    <Card className="hover:border-primary/40 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted">{title}</p>
          <h3 className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
            {value}
          </h3>
          {trend && (
            <span className="text-xs font-medium text-emerald-400 mt-1 inline-block">
              {trend}
            </span>
          )}
        </div>
        <div
          className="p-3 rounded-xl shadow-inner border border-white/5"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--primary)' }}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
      <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
      {description && <p className="text-xs text-muted mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Modal({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative overflow-hidden"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-muted hover:text-white">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
