import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base'
  }

  let styleObj: React.CSSProperties = {}
  let baseClass = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

  if (variant === 'primary') {
    styleObj = {
      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      color: '#ffffff'
    }
  } else if (variant === 'secondary') {
    styleObj = {
      backgroundColor: 'var(--surface)',
      color: 'var(--text)',
      border: '1px solid var(--border)'
    }
  } else if (variant === 'outline') {
    styleObj = {
      backgroundColor: 'transparent',
      borderColor: 'var(--border)',
      borderWidth: 1,
      color: 'var(--text)'
    }
  } else if (variant === 'danger') {
    styleObj = {
      backgroundColor: 'var(--accent)',
      color: '#ffffff'
    }
  } else {
    styleObj = {
      backgroundColor: 'transparent',
      color: 'var(--text)'
    }
  }

  return (
    <button
      className={`${baseClass} ${sizeStyles[size]} ${className}`}
      style={styleObj}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
