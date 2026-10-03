import { Suspense } from 'react'

import { Browser, BrowserFallback } from '@/components/Browser'
import { browseItems as items } from '@/lib/list'

import styles from './page.module.scss'

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
