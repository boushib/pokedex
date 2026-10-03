import { STATS, type StatKey } from '@/lib/pokemon'

import styles from './StatBars.module.scss'

/** Red for low, through yellow, to green and teal for the best */
const statColor = (v: number) => (v < 50 ? '#f05a4f' : v < 80 ? '#f59a3b' : v < 100 ? '#f2c94c' : v < 130 ? '#6cc36c' : '#2fb5a3')

export function StatBars({ stats, total }: { stats: Record<StatKey, number>; total: number }) {
  return (
    <dl className={styles.stats}>
      {STATS.map((s) => (
        <div key={s.key} className={styles.row}>
          <dt>{s.label}</dt>
          <dd className={styles.value}>{stats[s.key]}</dd>
          <dd className={styles.track} aria-hidden="true">
            <span style={{ width: `${Math.min(100, (stats[s.key] / 200) * 100)}%`, background: statColor(stats[s.key]) }} />
          </dd>
        </div>
      ))}
      <div className={`${styles.row} ${styles.total}`}>
        <dt>Total</dt>
        <dd className={styles.value}>{total}</dd>
        <dd />
      </div>
    </dl>
  )
}
