import Link from 'next/link'

import meta from '@/data/meta.json'
import { GENERATIONS } from '@/lib/pokemon'

import styles from './Footer.module.scss'
import { Mark } from './Logo'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Mark size={26} />
          <p>
            Data from <a href="https://pokeapi.co">PokéAPI</a>, last updated {new Date(meta.fetchedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. A fan
            project, not affiliated with Nintendo, Game Freak or The Pokémon Company. Pokémon and its names are their trademarks.
          </p>
        </div>
        <nav aria-label="Generations" className={styles.links}>
          {GENERATIONS.map((g) => (
            <Link key={g.id} href={`/?gen=${g.id}`}>
              {g.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Site" className={styles.links}>
          <Link href="/types">Type chart</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/team">My team</Link>
          <Link href="/favorites">Favorites</Link>
        </nav>
      </div>
    </footer>
  )
}
