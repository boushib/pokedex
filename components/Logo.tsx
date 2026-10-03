import Link from 'next/link'

import styles from './Logo.module.scss'

/** An original mark: a single lens with a glint on a softly graded red tile */
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={styles.mark}>
      <defs>
        <linearGradient id="pokedex-mark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2502a" />
          <stop offset="1" stopColor="#d42c08" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#pokedex-mark)" />
      <circle cx="20" cy="20" r="10.5" fill="#ffffff" />
      <circle cx="20" cy="20" r="6.5" fill="#15171f" />
      <circle cx="17.8" cy="17.8" r="1.9" fill="#ffffff" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Pokédex home">
      <Mark />
      <span className={`display ${styles.word}`}>Pokédex</span>
    </Link>
  )
}
