'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { CompareItem } from '@/lib/list'
import { artwork, dexNumber, STATS, titleCase } from '@/lib/format'
import { effectiveness, formatMultiplier } from '@/lib/types'

import styles from './Compare.module.scss'
import { PokemonPicker } from './PokemonPicker'
import { TypeBadge } from './TypeBadge'

/** The strongest multiplier any of the attacker's types gets against the defender */
const bestHit = (attacker: CompareItem, defender: CompareItem) =>
  attacker.types
    .map((type) => ({ type, multiplier: defender.types.reduce((m, d) => m * effectiveness(type, d), 1) }))
    .sort((a, b) => b.multiplier - a.multiplier)[0]

export function Compare({ items }: { items: CompareItem[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const bySlug = new Map(items.map((p) => [p.slug, p]))
  const a = bySlug.get(params.get('a') ?? '') ?? null
  const b = bySlug.get(params.get('b') ?? '') ?? null

  const set = (key: 'a' | 'b', slug: string | null) => {
    const next = new URLSearchParams(params)
    if (slug) next.set(key, slug)
    else next.delete(key)
    router.replace(`${pathname}?${next}`, { scroll: false })
  }

  const side = (key: 'a' | 'b', p: CompareItem | null, other: CompareItem | null) => (
    <div className={styles.side}>
      {p ? (
        <div className={styles.mon}>
          <button className={styles.change} onClick={() => set(key, null)}>
            Change
          </button>
          <Link href={`/pokemon/${p.slug}`}>
            <Image src={artwork(p.id)} className="artwork" alt="" width={180} height={180} />
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
          {other && (
            <p className={styles.hit}>
              Best attack type against {other.name}: <strong>{titleCase(bestHit(p, other).type)}</strong> ({formatMultiplier(bestHit(p, other).multiplier)})
            </p>
          )}
        </div>
      ) : (
        <div className={styles.pick}>
          <span className={styles.placeholder} aria-hidden="true">
            ?
          </span>
          <PokemonPicker items={items} placeholder={key === 'a' ? 'Choose the first Pokémon' : 'Choose the second Pokémon'} onPick={(x) => set(key, x.slug)} exclude={other ? [other.id] : []} />
        </div>
      )}
    </div>
  )

  return (
    <div>
      <div className={styles.versus}>
        {side('a', a, b)}
        <span className={`display ${styles.vs}`}>vs</span>
        {side('b', b, a)}
      </div>

      {a && b && (
        <section className={`card ${styles.table}`} aria-label="Stats compared">
          {[...STATS.map((s) => ({ label: s.label, x: a.stats[s.key], y: b.stats[s.key], max: 200, unit: '' })), { label: 'Total', x: a.total, y: b.total, max: 720, unit: '' }].map((row) => (
            <div key={row.label} className={styles.row}>
              <span className={`${styles.value} ${row.x > row.y ? styles.win : ''}`}>{row.x}</span>
              <span className={styles.barLeft}>
                <span style={{ width: `${Math.min(100, (row.x / row.max) * 100)}%` }} className={row.x >= row.y ? styles.lead : undefined} />
              </span>
              <span className={styles.label}>{row.label}</span>
              <span className={styles.barRight}>
                <span style={{ width: `${Math.min(100, (row.y / row.max) * 100)}%` }} className={row.y >= row.x ? styles.lead : undefined} />
              </span>
              <span className={`${styles.value} ${row.y > row.x ? styles.win : ''}`}>{row.y}</span>
            </div>
          ))}
          <div className={styles.row}>
            <span className={styles.value}>{a.height.toFixed(1)} m</span>
            <span />
            <span className={styles.label}>Height</span>
            <span />
            <span className={styles.value}>{b.height.toFixed(1)} m</span>
          </div>
          <div className={styles.row}>
            <span className={styles.value}>{a.weight.toFixed(1)} kg</span>
            <span />
            <span className={styles.label}>Weight</span>
            <span />
            <span className={styles.value}>{b.weight.toFixed(1)} kg</span>
          </div>
        </section>
      )}
    </div>
  )
}
