import type { Metadata } from 'next'
import { Suspense } from 'react'

import { TeamBuilder } from '@/components/TeamBuilder'
import { browseItems } from '@/lib/list'

import styles from '../types/page.module.scss'

export const metadata: Metadata = {
  title: 'Team builder',
  description: 'Build a team of six Pokémon and see which attacking types it is weak to or resists.',
  alternates: { canonical: '/team' },
}

export default function TeamPage() {
  return (
    <main className="container">
      <header className={styles.head}>
        <h1 className={`display ${styles.title}`}>My team</h1>
        <p className={styles.lead}>Pick up to six Pokémon and see how your team holds up against every type. Your team is saved in this browser.</p>
      </header>
      <Suspense>
        <TeamBuilder items={browseItems} />
      </Suspense>
    </main>
  )
}
