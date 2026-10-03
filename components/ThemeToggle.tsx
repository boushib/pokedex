'use client'

import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'
const KEY = 'pokedex-theme'

// Dark unless the visitor switched to light
const read = (): Theme => {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Switches between dark (the default) and light; the choice is remembered and applied before paint on the next visit */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme)

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    try {
      if (next === 'dark') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, next)
    } catch {
      // Private mode: the theme still changes for this visit
    }
    document.documentElement.setAttribute('data-theme', next)
    listeners.forEach((l) => l())
  }

  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  return (
    <button className="btn btn-ghost" style={{ width: 40, padding: 0 }} onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

/** Runs before the page paints, so a saved light theme never flashes dark first */
export const themeScript = `try{if(localStorage.getItem('${KEY}')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}`
