'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { GENERATIONS, titleCase } from '@/lib/pokemon'
import { TYPE_COLORS, TYPES } from '@/lib/types'

import styles from './Browser.module.scss'
import { type CardData, PokemonCard } from './PokemonCard'

export type BrowseItem = CardData & { generation: number; total: number; special: boolean }

const SORTS = [
  { id: 'number', label: 'Number' },
  { id: 'name', label: 'Name (A to Z)' },
  { id: 'total', label: 'Base stats (high to low)' },
] as const

const PAGE = 48

/** Lowercase, no accents: "Flabébé" matches "flabebe" */
const fold = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function Browser({ items }: { items: BrowseItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const type = params.get('type') ?? ''
  const gen = Number(params.get('gen')) || 0
  const sort = (params.get('sort') ?? 'number') as (typeof SORTS)[number]['id']
  const [shown, setShown] = useState(PAGE)
  const [input, setInput] = useState(q)
  const sentinel = useRef<HTMLDivElement>(null)

  // Updates the URL (so results can be shared and survive back/forward) without scrolling
  const set = (changes: Record<string, string | number | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '' || v === 0 || (k === 'sort' && v === 'number')) next.delete(k)
      else next.set(k, String(v))
    }
    setShown(PAGE)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  // Search as you type, a beat after the last key
  useEffect(() => {
    if (input === q) return
    const t = setTimeout(() => set({ q: input.trim() }), 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  const results = useMemo(() => {
    const term = fold(q.trim()).replace(/^#/, '')
    const number = /^\d+$/.test(term) ? Number(term) : null
    const list = items.filter(
      (p) =>
        (!type || p.types.includes(type)) &&
        (!gen || p.generation === gen) &&
        (!term || (number !== null ? String(p.id).includes(String(number)) : fold(p.name).includes(term) || p.types.some((t) => t.startsWith(term)))),
    )
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'total') list.sort((a, b) => b.total - a.total || a.id - b.id)
    return list
  }, [items, q, type, gen, sort])

  // Load more as the end of the grid comes into view
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && setShown((n) => n + PAGE), { rootMargin: '800px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [results])

  const filtered = Boolean(q || type || gen)

  return (
    <section aria-label="Pokémon">
      <div className={styles.controls}>
        <label className={styles.search}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M10.5 3a7.5 7.5 0 0 1 5.96 12.06l4.24 4.24-1.4 1.4-4.24-4.24A7.5 7.5 0 1 1 10.5 3m0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11" />
          </svg>
          <span className="sr-only">Search Pokémon</span>
          <input type="search" placeholder="Search by name, number or type" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
        </label>
        <select className="field" value={gen} onChange={(e) => set({ gen: Number(e.target.value) })} aria-label="Generation">
          <option value={0}>All generations</option>
          {GENERATIONS.map((g) => (
            <option key={g.id} value={g.id}>
              Gen {g.roman}: {g.name}
            </option>
          ))}
        </select>
        <select className="field" value={sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort by">
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.types} role="group" aria-label="Filter by type">
        {TYPES.map((t) => (
          <button
            key={t}
            className={`${styles.type} ${type === t ? styles.on : ''}`}
            style={{ '--type': TYPE_COLORS[t] } as React.CSSProperties}
            aria-pressed={type === t}
            onClick={() => set({ type: type === t ? null : t })}
          >
            {titleCase(t)}
          </button>
        ))}
      </div>

      <div className={styles.summary} aria-live="polite">
        <span>
          {results.length === items.length ? `All ${items.length.toLocaleString()} Pokémon` : `${results.length.toLocaleString()} of ${items.length.toLocaleString()} Pokémon`}
        </span>
        {filtered && (
          <button
            className={styles.clear}
            onClick={() => {
              setInput('')
              set({ q: null, type: null, gen: null })
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className={styles.empty}>No Pokémon match that. Try another name or number, or clear the filters.</p>
      ) : (
        <ul className={styles.grid}>
          {results.slice(0, shown).map((p, i) => (
            <li key={p.id}>
              <PokemonCard pokemon={p} priority={i < 8} />
            </li>
          ))}
        </ul>
      )}
      {shown < results.length && <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />}
    </section>
  )
}

/** What the server renders before the browser takes over: the first page, as plain links crawlers can follow */
export function BrowserFallback({ items }: { items: BrowseItem[] }) {
  return (
    <ul className={styles.grid} style={{ marginTop: 168 }}>
      {items.slice(0, PAGE).map((p, i) => (
        <li key={p.id}>
          <PokemonCard pokemon={p} priority={i < 8} />
        </li>
      ))}
    </ul>
  )
}
