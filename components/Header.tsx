import Link from 'next/link'

import styles from './Header.module.scss'
import { Logo } from './Logo'
import { TeamCount } from './TeamCount'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { href: '/', label: 'Pokédex' },
  { href: '/types', label: 'Type chart' },
  { href: '/compare', label: 'Compare' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo />
        <nav className={styles.nav} aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <Link href="/team" className={styles.team}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span>My team</span>
            <TeamCount />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
