import { useTheme } from '../../contexts/ThemeContext'
import { Palette, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text)'
        }}
        title="Change Theme"
      >
        <Palette size={16} style={{ color: 'var(--primary)' }} />
        <span className="hidden sm:inline capitalize">{theme}</span>
        <div
          className="w-3.5 h-3.5 rounded-full border"
          style={{
            backgroundColor: themes.find(t => t.id === theme)?.primary,
            borderColor: 'var(--border)'
          }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border shadow-xl p-2 z-50 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Select Color Theme
          </div>
          <div className="space-y-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all hover:opacity-90"
                style={{
                  backgroundColor: theme === t.id ? 'var(--surface)' : 'transparent',
                  color: 'var(--text)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: t.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: t.secondary }}
                    />
                  </div>
                  <span className="font-medium">{t.label}</span>
                </div>
                {theme === t.id && <Check size={16} style={{ color: 'var(--primary)' }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
