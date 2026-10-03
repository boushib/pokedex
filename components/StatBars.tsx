import { STATS, type StatKey, statPercentile } from '@/lib/pokemon'

import styles from './StatBars.module.scss'

/** Red for low, through yellow, to green and teal for the best */
const statColor = (v: number) => (v < 50 ? '#f05a4f' : v < 80 ? '#f59a3b' : v < 100 ? '#f2c94c' : v < 130 ? '#6cc36c' : '#2fb5a3')

/** "Top 8%" for the strong stats, "Bottom 20%" for the weak ones */
const rank = (pct: number) => (pct >= 50 ? `Top ${Math.max(1, 100 - pct)}%` : `Bottom ${Math.max(1, pct)}%`)

export function StatBars({ stats }: { stats: Record<StatKey, number> }) {
  return (
    <dl className={styles.stats}>
      {STATS.map((s, i) => {
        const v = stats[s.key]
        const pct = statPercentile(s.key, v)
        return (
          <div key={s.key} className={styles.row} style={{ '--i': i, '--c': statColor(v) } as React.CSSProperties}>
            <dt>{s.label}</dt>
            <dd className={styles.value}>{v}</dd>
            <dd className={styles.track} aria-hidden="true">
              <span style={{ width: `${Math.min(100, (v / 200) * 100)}%` }} />
            </dd>
            <dd className={`${styles.rank} ${pct >= 50 ? styles.good : ''}`}>{rank(pct)}</dd>
          </div>
        )
      })}
    </dl>
  )
}
