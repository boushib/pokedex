'use client'

import { useSyncExternalStore } from 'react'

/** Favorites and a team of up to six, kept in this browser */
export const TEAM_SIZE = 6

type Collection = { favorites: number[]; team: number[] }
const KEY = 'pokedex-collection'
const EMPTY: Collection = { favorites: [], team: [] }

let cache: Collection | null = null
const listeners = new Set<() => void>()

function read(): Collection {
  if (cache) return cache
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<Collection> | null
    const ids = (v: unknown) => (Array.isArray(v) ? v.filter((n): n is number => Number.isInteger(n) && n > 0 && n <= 1025) : [])
    cache = { favorites: ids(raw?.favorites), team: ids(raw?.team).slice(0, TEAM_SIZE) }
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(next: Collection) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage full or blocked: keep it for this visit
  }
  listeners.forEach((l) => l())
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  // Other tabs
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      fn()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCollection() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY)
  return {
    ...state,
    isFavorite: (id: number) => state.favorites.includes(id),
    inTeam: (id: number) => state.team.includes(id),
    teamFull: state.team.length >= TEAM_SIZE,
    toggleFavorite: (id: number) => {
      const c = read()
      write({ ...c, favorites: c.favorites.includes(id) ? c.favorites.filter((f) => f !== id) : [...c.favorites, id] })
    },
    /** Returns false when the team is already full */
    toggleTeam: (id: number) => {
      const c = read()
      if (c.team.includes(id)) {
        write({ ...c, team: c.team.filter((t) => t !== id) })
        return true
      }
      if (c.team.length >= TEAM_SIZE) return false
      write({ ...c, team: [...c.team, id] })
      return true
    },
    clearTeam: () => write({ ...read(), team: [] }),
  }
}
