import Image from 'next/image'
import Link from 'next/link'

import type { EvolutionNode } from '@/lib/evolution'
import { artwork, dexNumber } from '@/lib/pokemon'

import styles from './EvolutionChain.module.scss'
import { TypeBadge } from './TypeBadge'

function Stage({ node, current }: { node: EvolutionNode; current: number }) {
  const p = node.pokemon
  return (
    <li className={styles.stage}>
      <Link href={`/pokemon/${p.slug}`} className={`${styles.mon} ${p.id === current ? styles.current : ''}`} aria-current={p.id === current ? 'page' : undefined}>
        <Image src={artwork(p.id)} className="artwork" alt="" width={96} height={96} />
        <span className={styles.num}>{dexNumber(p.id)}</span>
        <span className={styles.name}>{p.name}</span>
        <span className={styles.types}>
          {p.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" link={false} />
          ))}
        </span>
      </Link>
      {node.next.length > 0 && (
        <ul className={`${styles.branches} ${node.next.length > 2 ? styles.many : ''}`}>
          {node.next.map((child) => (
            <li key={child.pokemon.id} className={styles.branch}>
              <span className={styles.how}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {child.how}
              </span>
              <ul>
                <Stage node={child} current={current} />
              </ul>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export function EvolutionChain({ tree, current }: { tree: EvolutionNode; current: number }) {
  if (!tree.next.length) return <p className={styles.none}>This Pokémon doesn’t evolve.</p>
  return (
    <ul className={styles.chain}>
      <Stage node={tree} current={current} />
    </ul>
  )
}
