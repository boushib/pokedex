import Link from 'next/link'

import { titleCase } from '@/lib/pokemon'
import { TYPE_COLORS } from '@/lib/types'

import styles from './TypeBadge.module.scss'

/** A type chip in its own color; links to the Pokédex filtered by that type */
export function TypeBadge({ type, size = 'md', link = true }: { type: string; size?: 'sm' | 'md' | 'lg'; link?: boolean }) {
  const style = { '--type': TYPE_COLORS[type] ?? '#888' } as React.CSSProperties
  const className = `${styles.badge} ${styles[size]}`
  if (!link) {
    return (
      <span className={className} style={style}>
        {titleCase(type)}
      </span>
    )
  }
  return (
    <Link href={`/?type=${type}`} className={className} style={style}>
      {titleCase(type)}
    </Link>
  )
}
