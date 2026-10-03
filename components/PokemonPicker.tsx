'use client'

import Image from 'next/image'
import { useId, useMemo, useRef, useState } from 'react'

import { artwork, dexNumber } from '@/lib/pokemon'

import type { BrowseItem } from './Browser'
import styles from './PokemonPicker.module.scss'

const fold = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** A search box that suggests Pokémon by name or number; arrow keys and Enter pick one */
export function PokemonPicker({ items, onPick, placeholder = 'Find a Pokémon', exclude = [], autoFocus }: { items: BrowseItem[]; onPick: (p: BrowseItem) => void; placeholder?: string; exclude?: number[]; autoFocus?: boolean }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const id = useId()
  const input = useRef<HTMLInputElement>(null)

  const matches = useMemo(() => {
    const term = fold(query.trim()).replace(/^#/, '')
    if (!term) return []
    const n = /^\d+$/.test(term) ? Number(term) : null
    return items
      .filter((p) => !exclude.includes(p.id) && (n !== null ? p.id === n || String(p.id).startsWith(term) : fold(p.name).includes(term)))
      .sort((a, b) => Number(!fold(a.name).startsWith(term)) - Number(!fold(b.name).startsWith(term)) || a.id - b.id)
      .slice(0, 8)
  }, [items, query, exclude])

  const pick = (p: BrowseItem) => {
    onPick(p)
    setQuery('')
    setOpen(false)
    input.current?.focus()
  }

  return (
    <div className={styles.picker}>
      <input
        ref={input}
        className="field"
        type="search"
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-controls={`${id}-list`}
        aria-activedescendant={matches[active] ? `${id}-${matches[active].id}` : undefined}
        aria-autocomplete="list"
        placeholder={placeholder}
        value={query}
        autoFocus={autoFocus}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, matches.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
          } else if (e.key === 'Enter' && matches[active]) {
            e.preventDefault()
            pick(matches[active])
          } else if (e.key === 'Escape') setOpen(false)
        }}
      />
      {open && matches.length > 0 && (
        <ul id={`${id}-list`} role="listbox" className={styles.list}>
          {matches.map((p, i) => (
            <li
              key={p.id}
              id={`${id}-${p.id}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? styles.active : undefined}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(p)}
            >
              <Image src={artwork(p.id)} alt="" width={36} height={36} />
              <span className={styles.name}>{p.name}</span>
              <span className={styles.num}>{dexNumber(p.id)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
