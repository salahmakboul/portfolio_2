export type Theme = 'dark' | 'light' | 'orange'

export const THEMES: Theme[] = ['dark', 'light', 'orange']
const STORAGE_KEY = 'theme'

export function getStoredTheme(): Theme {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    if (t === 'dark' || t === 'light' || t === 'orange') return t
  } catch {
    /* storage unavailable */
  }
  return 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage unavailable — theme just won't persist */
  }
}
