import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Compare } from '@/components/Compare'
import { compareItems } from '@/lib/list'

import styles from '../types/page.module.scss'

export const metadata: Metadata = {
  title: 'Compare Pokémon',
  description: 'Put two Pokémon side by side: base stats, types, size and which attack type works best against the other.',
  alternates: { canonical: '/compare' },
}

export default function ComparePage() {
  return (
    <main className="container">
      <header className={styles.head}>
        <h1 className={`display ${styles.title}`}>Compare</h1>
        <p className={styles.lead}>Put two Pokémon side by side to see who comes out ahead.</p>
      </header>
      <Suspense>
        <Compare items={compareItems} />
      </Suspense>
    </main>
  )
}
