import Image from 'next/image'
import Link from 'next/link'

import type { EvolutionNode } from '@/lib/evolution'
import { artwork, dexNumber } from '@/lib/pokemon'
import { TYPE_COLORS } from '@/lib/types'

import styles from './EvolutionChain.module.scss'
import { TypeBadge } from './TypeBadge'

function Stage({ node, current }: { node: EvolutionNode; current: number }) {
  const p = node.pokemon
  return (
    <li className={styles.stage}>
      <Link
        href={`/pokemon/${p.slug}`}
        className={`${styles.mon} ${p.id === current ? styles.current : ''}`}
        aria-current={p.id === current ? 'page' : undefined}
        style={{ '--t': TYPE_COLORS[p.types[0]] } as React.CSSProperties}
      >
        <span className={styles.disc}>
          <Image src={artwork(p.id)} className="artwork" alt="" width={120} height={120} />
        </span>
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
                <span className={styles.pill}>{child.how}</span>
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
