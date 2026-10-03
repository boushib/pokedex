'use client'

import Link from 'next/link'

import { useCollection } from '@/lib/collection'

import type { BrowseItem } from './Browser'
import browser from './Browser.module.scss'
import { PokemonCard } from './PokemonCard'

export function FavoritesGrid({ items }: { items: BrowseItem[] }) {
  const { favorites } = useCollection()
  const byId = new Map(items.map((p) => [p.id, p]))
  const list = favorites.map((id) => byId.get(id)).filter((p): p is BrowseItem => !!p)
  if (!list.length) {
    return (
      <p className={browser.empty}>
        No favorites yet. Tap the heart on any Pokémon’s page to keep it here. <Link href="/" style={{ color: 'var(--brand)', fontWeight: 600 }}>Browse the Pokédex</Link>
      </p>
    )
  }
  return (
    <ul className={browser.grid}>
      {list.map((p) => (
        <li key={p.id}>
          <PokemonCard pokemon={p} />
        </li>
      ))}
    </ul>
  )
}
