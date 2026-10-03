import type { Metadata } from 'next'

import { TypeBadge } from '@/components/TypeBadge'
import { titleCase } from '@/lib/pokemon'
import { effectiveness, formatMultiplier, TYPE_COLORS, TYPES } from '@/lib/types'

import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Pokémon type chart: strengths, weaknesses and immunities',
  description: 'The full Pokémon type chart: how much damage each of the 18 attacking types deals to every defending type, with super effective, not very effective and no-effect matchups.',
  alternates: { canonical: '/types' },
}

const cellClass = (m: number) => (m === 2 ? styles.super : m === 0.5 ? styles.weak : m === 0 ? styles.none : '')

export default function TypeChartPage() {
  return (
    <main className="container">
      <header className={styles.head}>
        <h1 className={`display ${styles.title}`}>Type chart</h1>
        <p className={styles.lead}>Read across from the attacking type to the defending type to see how much damage the attack does. Pokémon with two types multiply both.</p>
        <ul className={styles.legend}>
          <li>
            <span className={`${styles.swatch} ${styles.super}`}>2×</span> Super effective
          </li>
          <li>
            <span className={`${styles.swatch} ${styles.weak}`}>½×</span> Not very effective
          </li>
          <li>
            <span className={`${styles.swatch} ${styles.none}`}>0×</span> No effect
          </li>
        </ul>
      </header>
      <div className={styles.scroll}>
        <table className={styles.chart}>
          <caption className="sr-only">Damage multiplier of each attacking type (rows) against each defending type (columns)</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.corner}>
                <span>Attack ↓</span>
                <span>Defense →</span>
              </th>
              {TYPES.map((t) => (
                <th key={t} scope="col" className={styles.colHead} style={{ background: TYPE_COLORS[t] }} title={titleCase(t)}>
                  <span>{titleCase(t).slice(0, 3)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPES.map((attack) => (
              <tr key={attack}>
                <th scope="row" className={styles.rowHead}>
                  <TypeBadge type={attack} size="sm" />
                </th>
                {TYPES.map((defend) => {
                  const m = effectiveness(attack, defend)
                  return (
                    <td key={defend} className={cellClass(m)} title={`${titleCase(attack)} → ${titleCase(defend)}: ${formatMultiplier(m)}`}>
                      {m === 1 ? '' : formatMultiplier(m)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
