import type { Metadata } from 'next'

import { FavoritesGrid } from '@/components/FavoritesGrid'
import { browseItems } from '@/lib/list'

import styles from '../types/page.module.scss'

export const metadata: Metadata = { title: 'Favorites', robots: { index: false, follow: true }, alternates: { canonical: '/favorites' } }

export default function FavoritesPage() {
  return (
    <main className="container">
      <header className={styles.head}>
        <h1 className={`display ${styles.title}`}>Favorites</h1>
        <p className={styles.lead}>The Pokémon you’ve hearted, saved in this browser.</p>
      </header>
      <FavoritesGrid items={browseItems} />
    </main>
  )
}
