export default function Avatar({
  src,
  name = 'User',
  size = 'md',
  className = ''
}: {
  src?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-white/10 ${sizeMap[size]} ${className}`}
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = 'none'
        }}
      />
    )
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shadow-sm ${sizeMap[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
      }}
    >
      {initials || 'U'}
    </div>
  )
}
