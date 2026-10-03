'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { CompareItem } from '@/lib/list'
import { artwork, dexNumber, STATS, type StatKey } from '@/lib/format'
import { effectiveness, formatMultiplier, TYPE_COLORS } from '@/lib/types'

import styles from './Compare.module.scss'
import { PokemonPicker } from './PokemonPicker'
import { TypeBadge } from './TypeBadge'

/** The strongest multiplier any of the attacker's types gets against the defender */
const bestHit = (attacker: CompareItem, defender: CompareItem) =>
  attacker.types
    .map((type) => ({ type, multiplier: defender.types.reduce((m, d) => m * effectiveness(type, d), 1) }))
    .sort((a, b) => b.multiplier - a.multiplier)[0]

const SUGGESTIONS = [
  ['charizard', 'blastoise'],
  ['garchomp', 'dragonite'],
  ['mewtwo', 'mew'],
  ['lucario', 'zoroark'],
]

// Two stat hexagons on one chart
const ORDER: StatKey[] = ['hp', 'attack', 'defense', 'speed', 'spDefense', 'spAttack']
const point = (i: number, r: number) => {
  const a = (Math.PI * 2 * i) / 6 - Math.PI / 2
  return [130 + Math.cos(a) * r, 130 + Math.sin(a) * r] as const
}
const hexagon = (r: (i: number) => number) => ORDER.map((_, i) => point(i, r(i)).join(',')).join(' ')

function DuelRadar({ a, b }: { a: CompareItem; b: CompareItem }) {
  const label = Object.fromEntries(STATS.map((s) => [s.key, s.short]))
  const shape = (p: CompareItem) => hexagon((i) => (Math.min(p.stats[ORDER[i]], 150) / 150) * 92)
  return (
    <svg viewBox="0 0 260 260" className={styles.radar} role="img" aria-label={`Stat shapes of ${a.name} and ${b.name}`}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={hexagon(() => 92 * f)} className={styles.radarRing} />
      ))}
      <polygon points={shape(a)} className={`${styles.radarShape} ${styles.shapeA}`} />
      <polygon points={shape(b)} className={`${styles.radarShape} ${styles.shapeB}`} />
      {ORDER.map((k, i) => {
        const [x, y] = point(i, 114)
        return (
          <text key={k} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className={styles.radarLabel}>
            {label[k]}
          </text>
        )
      })}
    </svg>
  )
}

export function Compare({ items }: { items: CompareItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const bySlug = new Map(items.map((p) => [p.slug, p]))
  const a = bySlug.get(params.get('a') ?? '') ?? null
  const b = bySlug.get(params.get('b') ?? '') ?? null

  const go = (next: URLSearchParams) => router.replace(`${pathname}?${next}`, { scroll: false })
  const set = (key: 'a' | 'b', slug: string | null) => {
    const next = new URLSearchParams(params)
    if (slug) next.set(key, slug)
    else next.delete(key)
    go(next)
  }
  const swap = () => {
    const next = new URLSearchParams()
    if (b) next.set('a', b.slug)
    if (a) next.set('b', a.slug)
    go(next)
  }

  const colorA = a ? TYPE_COLORS[a.types[0]] : '#8d92a3'
  const colorB = b ? TYPE_COLORS[b.types[0]] : '#8d92a3'

  const fighter = (key: 'a' | 'b', p: CompareItem | null, other: CompareItem | null) =>
    p ? (
      <div className={`${styles.fighter} ${key === 'b' ? styles.right : ''}`} key={p.slug}>
        <button className={styles.change} onClick={() => set(key, null)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 4v6h6M20 20v-6h-6M5.5 15A7 7 0 0 0 18 17M18.5 9A7 7 0 0 0 6 7" />
          </svg>
          Change
        </button>
        <Link href={`/pokemon/${p.slug}`} className={styles.art}>
          <Image src={artwork(p.id)} className="artwork" alt={p.name} width={260} height={260} priority quality={90} />
        </Link>
        <span className={styles.num}>{dexNumber(p.id)}</span>
        <Link href={`/pokemon/${p.slug}`} className={`display ${styles.name}`}>
          {p.name}
        </Link>
        <span className={styles.types}>
          {p.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </span>
      </div>
    ) : (
      <div className={`${styles.fighter} ${styles.empty}`}>
        <span className={styles.mystery} aria-hidden="true">
          ?
        </span>
        <p className={styles.emptyTitle}>{key === 'a' ? 'Choose a challenger' : 'Choose an opponent'}</p>
        <div className={styles.pickerWrap}>
          <PokemonPicker items={items} placeholder="Search by name or number" onPick={(x) => set(key, x.slug)} exclude={other ? [other.id] : []} />
        </div>
      </div>
    )

  const rows = a && b ? [...STATS.map((s) => ({ key: s.key as string, label: s.label, x: a.stats[s.key], y: b.stats[s.key], max: 200 })), { key: 'total', label: 'Total', x: a.total, y: b.total, max: 720 }] : []
  const winsA = rows.filter((r) => r.key !== 'total' && r.x > r.y).length
  const winsB = rows.filter((r) => r.key !== 'total' && r.y > r.x).length
  const leader = a && b ? (a.total === b.total ? null : a.total > b.total ? a : b) : null
  const tallest = a && b ? Math.max(a.height, b.height) : 1

  return (
    <div className={styles.wrap} style={{ '--a': colorA, '--b': colorB } as React.CSSProperties}>
      <section className={styles.arena} aria-label="The two Pokémon">
        <span className={styles.splitA} aria-hidden="true" />
        <span className={styles.splitB} aria-hidden="true" />
        {fighter('a', a, b)}
        <div className={styles.center}>
          <span className={`display ${styles.vs}`}>VS</span>
          {(a || b) && (
            <button className={styles.swap} onClick={swap} aria-label="Swap sides">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7h13l-4-4M17 17H4l4 4" />
              </svg>
            </button>
          )}
        </div>
        {fighter('b', b, a)}
      </section>

      {!(a && b) && (
        <div className={styles.suggest}>
          <span>Try a classic:</span>
          {SUGGESTIONS.map(([x, y]) => (
            <Link key={x} href={`/compare?a=${x}&b=${y}`} scroll={false}>
              {bySlug.get(x)?.name} vs {bySlug.get(y)?.name}
            </Link>
          ))}
        </div>
      )}

      {a && b && (
        <>
          <section className={styles.verdict} aria-label="Verdict">
            <div className={styles.verdictText}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.crown}>
                <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
              </svg>
              {leader ? (
                <p>
                  <strong>{leader.name}</strong> comes out ahead with <strong>{Math.abs(a.total - b.total)}</strong> more base stat points
                </p>
              ) : (
                <p>Dead even: both have a base stat total of {a.total}</p>
              )}
            </div>
            <div className={styles.score}>
              <span className={styles.scoreA}>{winsA}</span>
              <span className={styles.scoreLabel}>stats won</span>
              <span className={styles.scoreB}>{winsB}</span>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="duel">
            <h2 id="duel" className={`display ${styles.heading}`}>
              Stats duel
            </h2>
            <div className={styles.duel}>
              {rows.map((row, i) => (
                <div key={row.key} className={`${styles.row} ${row.key === 'total' ? styles.totalRow : ''}`} style={{ '--i': i } as React.CSSProperties}>
                  <span className={`${styles.value} ${row.x > row.y ? styles.win : ''}`}>
                    {row.x > row.y && <em>+{row.x - row.y}</em>}
                    {row.x}
                  </span>
                  <span className={`${styles.bar} ${styles.barA}`}>
                    <span style={{ width: `${Math.min(100, (row.x / row.max) * 100)}%` }} className={row.x >= row.y ? styles.lead : undefined} />
                  </span>
                  <span className={styles.label}>{row.label}</span>
                  <span className={`${styles.bar} ${styles.barB}`}>
                    <span style={{ width: `${Math.min(100, (row.y / row.max) * 100)}%` }} className={row.y >= row.x ? styles.lead : undefined} />
                  </span>
                  <span className={`${styles.value} ${row.y > row.x ? styles.win : ''}`}>
                    {row.y}
                    {row.y > row.x && <em>+{row.y - row.x}</em>}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.grid}>
            <section className={styles.panel} aria-labelledby="shape">
              <h2 id="shape" className={`display ${styles.heading}`}>
                Stat shape
              </h2>
              <DuelRadar a={a} b={b} />
              <p className={styles.key}>
                <span className={styles.keyA}>{a.name}</span>
                <span className={styles.keyB}>{b.name}</span>
              </p>
            </section>

            <section className={styles.panel} aria-labelledby="matchup">
              <h2 id="matchup" className={`display ${styles.heading}`}>
                Matchup
              </h2>
              {[
                [a, b],
                [b, a],
              ].map(([x, y]) => {
                const hit = bestHit(x, y)
                const tone = hit.multiplier > 1 ? styles.strong : hit.multiplier < 1 ? styles.weak : ''
                return (
                  <div key={x.slug} className={styles.attack}>
                    <Image src={artwork(x.id)} className="artwork" alt="" width={48} height={48} />
                    <p>
                      <strong>{x.name}</strong>’s best attack type against {y.name}
                      <span className={styles.attackType}>
                        <TypeBadge type={hit.type} size="sm" link={false} />
                      </span>
                    </p>
                    <span className={`${styles.multiplier} ${tone}`}>{formatMultiplier(hit.multiplier)}</span>
                  </div>
                )
              })}

              <h3 className={styles.sub}>Size</h3>
              <div className={styles.size}>
                {[a, b].map((p, i) => (
                  <div key={p.slug} className={styles.sizeMon}>
                    <div className={styles.sizeBox}>
                      <Image
                        src={artwork(p.id)}
                        className={`artwork ${i === 1 ? styles.flip : ''}`}
                        alt=""
                        width={150}
                        height={150}
                        style={{ height: `${Math.max(18, (p.height / tallest) * 100)}%`, width: 'auto' }}
                      />
                    </div>
                    <p>
                      <strong>{p.height.toFixed(1)} m</strong>
                      <span>{p.weight.toFixed(1)} kg</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
