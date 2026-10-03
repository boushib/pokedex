import Link from 'next/link'

import styles from './Logo.module.scss'

/** An original mark: a Pokédex device with its big blue lens and status lights */
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={styles.mark}>
      <rect x="2" y="2" width="36" height="36" rx="11" fill="var(--brand)" />
      <circle cx="16" cy="18" r="9.5" fill="#ffffff" />
      <circle cx="16" cy="18" r="6.5" fill="#3a8ef6" />
      <circle cx="13.6" cy="15.6" r="2" fill="#ffffff" opacity="0.85" />
      <circle cx="29" cy="11" r="2.2" fill="#ffcf3a" />
      <circle cx="29" cy="18" r="2.2" fill="#4cd964" />
      <rect x="9" y="30" width="22" height="3" rx="1.5" fill="#ffffff" opacity="0.55" />
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
