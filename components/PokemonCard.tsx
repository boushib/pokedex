'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { artwork, dexNumber } from '@/lib/format'
import { TYPE_COLORS } from '@/lib/types'

import styles from './PokemonCard.module.scss'
import { TypeBadge } from './TypeBadge'

export type CardData = { id: number; slug: string; name: string; types: string[] }

/** A card tinted with the Pokémon's main type that tilts toward the pointer */
export function PokemonCard({ pokemon, priority = false }: { pokemon: CardData; priority?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const color = TYPE_COLORS[pokemon.types[0]] ?? '#888'

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <Link
      ref={ref}
      href={`/pokemon/${pokemon.slug}`}
      className={styles.card}
      style={{ '--type': color } as React.CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className={styles.number}>{dexNumber(pokemon.id)}</span>
      <div className={styles.art}>
        <Image src={artwork(pokemon.id)} className="artwork" alt="" width={200} height={200} sizes="(max-width: 600px) 40vw, 180px" priority={priority} />
      </div>
      <div className={styles.info}>
        <h2 className={`display ${styles.name}`}>{pokemon.name}</h2>
        <div className={styles.types}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" link={false} />
          ))}
        </div>
      </div>
    </Link>
  )
}
