'use client'

import Link from 'next/link'
import { useState } from 'react'

import { titleCase } from '@/lib/format'
import { effectiveness, formatMultiplier, TYPE_COLORS, TYPES } from '@/lib/types'

import styles from './TypeExplorer.module.scss'
import { TypeIcon } from './TypeIcon'

type Group = { title: string; hint: string; tone: 'good' | 'bad' | 'none'; list: { type: string; m: number }[] }

function groupsFor(type: string): { attack: Group[]; defense: Group[] } {
  const atk = TYPES.map((t) => ({ type: t, m: effectiveness(type, t) }))
  const def = TYPES.map((t) => ({ type: t, m: effectiveness(t, type) }))
  return {
    attack: [
      { title: 'Super effective against', hint: '2× damage', tone: 'good', list: atk.filter((x) => x.m > 1) },
      { title: 'Not very effective against', hint: '½× damage', tone: 'bad', list: atk.filter((x) => x.m > 0 && x.m < 1) },
      { title: 'No effect on', hint: '0× damage', tone: 'none', list: atk.filter((x) => x.m === 0) },
    ],
    defense: [
      { title: 'Weak to', hint: 'takes 2×', tone: 'bad', list: def.filter((x) => x.m > 1) },
      { title: 'Resists', hint: 'takes ½×', tone: 'good', list: def.filter((x) => x.m > 0 && x.m < 1) },
      { title: 'Immune to', hint: 'takes 0×', tone: 'good', list: def.filter((x) => x.m === 0) },
    ],
  }
}

/** Pick a type and see everything it hits, and everything that hits it */
export function TypeExplorer({ counts }: { counts: Record<string, number> }) {
  const [type, setType] = useState('fire')
  const { attack, defense } = groupsFor(type)
  const color = TYPE_COLORS[type]

  const column = (heading: string, groups: Group[]) => (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{heading}</h3>
      {groups.map((g) => (
        <div key={g.title} className={`${styles.group} ${styles[g.tone]}`}>
          <p className={styles.groupTitle}>
            {g.title}
            <span>{g.hint}</span>
          </p>
          {g.list.length === 0 ? (
            <p className={styles.empty}>No types</p>
          ) : (
            <ul className={styles.chips}>
              {g.list.map((x, i) => (
                <li key={x.type} style={{ '--t': TYPE_COLORS[x.type], '--i': i } as React.CSSProperties}>
                  <button type="button" onClick={() => setType(x.type)} title={`${titleCase(x.type)}: ${formatMultiplier(x.m)}`}>
                    <TypeIcon type={x.type} size={14} />
                    {titleCase(x.type)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <section className={styles.explorer} style={{ '--sel': color } as React.CSSProperties} aria-labelledby="explorer">
      <h2 id="explorer" className="sr-only">
        Type explorer
      </h2>
      <div className={styles.picker} role="radiogroup" aria-label="Pick a type">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={t === type}
            className={`${styles.pick} ${t === type ? styles.active : ''}`}
            style={{ '--t': TYPE_COLORS[t] } as React.CSSProperties}
            onClick={() => setType(t)}
          >
            <span className={styles.orb}>
              <TypeIcon type={t} size={18} />
            </span>
            {titleCase(t)}
          </button>
        ))}
      </div>

      <div className={styles.detail} key={type}>
        <div className={styles.feature}>
          <span className={styles.bigOrb}>
            <TypeIcon type={type} size={44} />
          </span>
          <div>
            <p className={styles.eyebrow}>Type</p>
            <p className={`display ${styles.typeName}`}>{titleCase(type)}</p>
            <Link href={`/?type=${type}`} className={styles.count}>
              {counts[type]} Pokémon have this type →
            </Link>
          </div>
        </div>
        <div className={styles.columns}>
          {column('When attacking', attack)}
          {column('When defending', defense)}
        </div>
      </div>
    </section>
  )
}
