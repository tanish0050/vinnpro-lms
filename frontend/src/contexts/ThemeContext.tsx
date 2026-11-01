import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'purple'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: { id: Theme; label: string; primary: string; secondary: string; bg: string }[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export const themeList = [
  { id: 'light' as Theme, label: 'Light', primary: '#6366f1', secondary: '#8b5cf6', bg: '#f8fafc' },
  { id: 'dark' as Theme, label: 'Dark', primary: '#818cf8', secondary: '#a78bfa', bg: '#0f172a' },
  { id: 'ocean' as Theme, label: 'Ocean', primary: '#0ea5e9', secondary: '#06b6d4', bg: '#0c1b33' },
  { id: 'forest' as Theme, label: 'Forest', primary: '#22c55e', secondary: '#16a34a', bg: '#0a1f0a' },
  { id: 'sunset' as Theme, label: 'Sunset', primary: '#f97316', secondary: '#ef4444', bg: '#1c0a00' },
  { id: 'purple' as Theme, label: 'Purple', primary: '#a855f7', secondary: '#7c3aed', bg: '#0d0520' },
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('vinnpro-theme') as Theme) || 'dark'
  })

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('vinnpro-theme', newTheme)
  }

  useEffect(() => {
    const html = document.documentElement
    themeList.forEach(t => html.classList.remove(`theme-${t.id}`))
    html.classList.add(`theme-${theme}`)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: themeList }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
