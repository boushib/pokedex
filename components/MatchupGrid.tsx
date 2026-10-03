import { titleCase } from '@/lib/format'
import { formatMultiplier, TYPE_COLORS } from '@/lib/types'

import styles from './MatchupGrid.module.scss'

const effect = (m: number) => (m === 0 ? 'immune' : m >= 4 ? 'weak4' : m > 1 ? 'weak' : m <= 0.25 ? 'resist4' : m < 1 ? 'resist' : 'normal')

/** All 18 attacking types, each tile colored by how hard it hits */
export function MatchupGrid({ profile }: { profile: { type: string; multiplier: number }[] }) {
  const count = (test: (m: number) => boolean) => profile.filter((p) => test(p.multiplier)).length
  return (
    <>
      <p className={styles.summary}>
        <span className={styles.weakText}>Weak to {count((m) => m > 1)}</span>
        <span className={styles.resistText}>Resists {count((m) => m > 0 && m < 1)}</span>
        <span>Immune to {count((m) => m === 0)}</span>
      </p>
      <ul className={styles.grid}>
        {profile.map(({ type, multiplier }, i) => (
          <li
            key={type}
            className={`${styles.tile} ${styles[effect(multiplier)]}`}
            style={{ '--t': TYPE_COLORS[type], '--i': i } as React.CSSProperties}
            title={`${titleCase(type)} attacks: ${formatMultiplier(multiplier)}`}
          >
            <span className={styles.type}>{titleCase(type)}</span>
            <span className={styles.mult}>{formatMultiplier(multiplier)}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
