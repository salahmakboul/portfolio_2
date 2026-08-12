import { useEffect, useState } from 'react'
import { Flame, Moon, Sun } from 'lucide-react'
import { applyTheme, getStoredTheme, THEMES, type Theme } from '@/lib/theme'

const ICON: Record<Theme, typeof Moon> = { dark: Moon, light: Sun, orange: Flame }
const LABEL: Record<Theme, string> = { dark: 'Dark', light: 'Light', orange: 'Orange' }

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(getStoredTheme())
  }, [])

  const pick = (t: Theme) => {
    setTheme(t)
    applyTheme(t)
  }

  return (
    <div className="glass flex items-center gap-0.5 rounded-full p-1" role="radiogroup" aria-label="Color theme">
      {THEMES.map((t) => {
        const Icon = ICON[t]
        const active = t === theme
        return (
          <button
            key={t}
            role="radio"
            aria-checked={active}
            aria-label={`${LABEL[t]} theme`}
            data-cursor={LABEL[t]}
            onClick={() => pick(t)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/70 ${
              active ? 'bg-white/10 text-white' : 'text-mist hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        )
      })}
    </div>
  )
}
