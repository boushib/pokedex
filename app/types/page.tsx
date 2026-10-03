import type { Metadata } from 'next'

import { TypeExplorer } from '@/components/TypeExplorer'
import { TypeIcon } from '@/components/TypeIcon'
import { allPokemon, titleCase } from '@/lib/pokemon'
import { effectiveness, formatMultiplier, TYPE_COLORS, TYPES } from '@/lib/types'

import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Pokémon type chart: strengths, weaknesses and immunities',
  description: 'The full Pokémon type chart: how much damage each of the 18 attacking types deals to every defending type, with super effective, not very effective and no-effect matchups.',
  alternates: { canonical: '/types' },
}

const cellClass = (m: number) => (m === 2 ? styles.super : m === 0.5 ? styles.weak : m === 0 ? styles.none : styles.plain)

export default function TypeChartPage() {
  const counts = Object.fromEntries(TYPES.map((t) => [t, allPokemon.filter((p) => p.types.includes(t)).length]))
  const pairs = TYPES.flatMap((a) => TYPES.map((d) => effectiveness(a, d)))
  const stat = (m: number) => pairs.filter((x) => x === m).length

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>18 types · 324 matchups</p>
            <h1 className={`display ${styles.title}`}>Type chart</h1>
            <p className={styles.lead}>Every attack has a type, and so does every Pokémon. Pick a type to see what it beats and what beats it, or read the full chart below.</p>
            <dl className={styles.stats}>
              <div>
                <dt>Super effective</dt>
                <dd>{stat(2)}</dd>
              </div>
              <div>
                <dt>Not very effective</dt>
                <dd>{stat(0.5)}</dd>
              </div>
              <div>
                <dt>No effect</dt>
                <dd>{stat(0)}</dd>
              </div>
            </dl>
          </div>

          {/* The 18 types orbiting a center, each counter-rotating to stay upright */}
          <div className={styles.orbit} aria-hidden="true">
            <span className={styles.orbitRing} />
            <span className={styles.orbitRing2} />
            <div className={styles.orbitCenter}>
              <strong>18</strong>
              <span>types</span>
            </div>
            <div className={styles.spinner}>
              {TYPES.map((t, i) => (
                <span key={t} className={styles.planet} style={{ '--a': `${(360 / TYPES.length) * i}deg`, '--t': TYPE_COLORS[t] } as React.CSSProperties}>
                  <span>
                    <TypeIcon type={t} size={18} />
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        <TypeExplorer counts={counts} />

        <section className={styles.chartCard} aria-labelledby="chart">
          <header className={styles.chartHead}>
            <div>
              <h2 id="chart" className={`display ${styles.heading}`}>
                The full chart
              </h2>
              <p className={styles.note}>Attacking types down the side, defending types across the top. Pokémon with two types multiply both.</p>
            </div>
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
                    <span>Defending →</span>
                    <span>Attacking ↓</span>
                  </th>
                  {TYPES.map((t) => (
                    <th key={t} scope="col" className={styles.colHead} style={{ '--t': TYPE_COLORS[t] } as React.CSSProperties}>
                      <span className={styles.colOrb}>
                        <TypeIcon type={t} size={16} />
                      </span>
                      <span className={styles.colName}>{titleCase(t)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TYPES.map((attack) => (
                  <tr key={attack}>
                    <th scope="row" className={styles.rowHead} style={{ '--t': TYPE_COLORS[attack] } as React.CSSProperties}>
                      <span className={styles.rowOrb}>
                        <TypeIcon type={attack} size={14} />
                      </span>
                      {titleCase(attack)}
                    </th>
                    {TYPES.map((defend) => {
                      const m = effectiveness(attack, defend)
                      return (
                        <td key={defend} className={cellClass(m)} title={`${titleCase(attack)} → ${titleCase(defend)}: ${formatMultiplier(m)}`}>
                          <span>{m === 1 ? '' : formatMultiplier(m)}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
