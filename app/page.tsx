import { Suspense } from 'react'

import { Browser, BrowserFallback, type BrowseItem } from '@/components/Browser'
import { allPokemon } from '@/lib/pokemon'

import styles from './page.module.scss'

// A compact list for the browser: everything it searches, filters and sorts on
const items: BrowseItem[] = allPokemon.map((p) => ({ id: p.id, slug: p.slug, name: p.name, types: p.types, generation: p.generation, total: p.total, special: p.legendary || p.mythical }))

export default function Home() {
  return (
    <main className="container">
      <header className={styles.hero}>
        <h1 className={`display ${styles.title}`}>Every Pokémon, at a glance</h1>
        <p className={styles.lead}>Stats, abilities, evolutions and type matchups for all {items.length.toLocaleString()} Pokémon, from Bulbasaur to Pecharunt.</p>
      </header>
      <Suspense fallback={<BrowserFallback items={items} />}>
        <Browser items={items} />
      </Suspense>
    </main>
  )
}
