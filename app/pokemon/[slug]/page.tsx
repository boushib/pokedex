import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CollectionButtons } from '@/components/CollectionButtons'
import { EvolutionChain } from '@/components/EvolutionChain'
import { JsonLd } from '@/components/JsonLd'
import { MatchupGrid } from '@/components/MatchupGrid'
import { StatBars } from '@/components/StatBars'
import { StatRadar } from '@/components/StatRadar'
import { TypeBadge } from '@/components/TypeBadge'
import { evolutionTree, familySize } from '@/lib/evolution'
import { abilities, allPokemon, artwork, artworkPng, dexNumber, GENERATIONS, getPokemon, neighbours, titleCase, totalPercentile } from '@/lib/pokemon'
import { absolute, site } from '@/lib/site'
import { defenseProfile, TYPE_COLORS } from '@/lib/types'

import styles from './page.module.scss'

// Every Pokémon is built ahead of time; anything else is a 404
export const dynamicParams = false
export const generateStaticParams = () => allPokemon.map((p) => ({ slug: p.slug }))

const describe = (p: NonNullable<ReturnType<typeof getPokemon>>) => {
  const types = p.types.map(titleCase).join('/')
  return `${p.name} (${dexNumber(p.id)}) is ${/^[AEIOU]/.test(types) ? 'an' : 'a'} ${types}-type ${p.genus}. ${p.flavor}`.slice(0, 300)
}

export async function generateMetadata(props: PageProps<'/pokemon/[slug]'>): Promise<Metadata> {
  const p = getPokemon((await props.params).slug)
  if (!p) return {}
  const title = `${p.name} ${dexNumber(p.id)}: stats, evolutions and weaknesses`
  const description = describe(p)
  return {
    title,
    description,
    alternates: { canonical: `/pokemon/${p.slug}` },
    openGraph: { type: 'article', url: `/pokemon/${p.slug}`, title: `${p.name} | ${site.name}`, description },
    twitter: { card: 'summary_large_image', title: `${p.name} | ${site.name}`, description },
  }
}

export default async function PokemonPage(props: PageProps<'/pokemon/[slug]'>) {
  const p = getPokemon((await props.params).slug)
  if (!p) notFound()
  const { previous, next } = neighbours(p)
  const tree = evolutionTree(p)
  const gen = GENERATIONS.find((g) => g.id === p.generation)
  const color = TYPE_COLORS[p.types[0]]
  const accent = TYPE_COLORS[p.types[1] ?? p.types[0]]

  return (
    <main className={styles.page} style={{ '--type': color, '--accent': accent } as React.CSSProperties}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${p.name} ${dexNumber(p.id)}`,
          description: describe(p),
          url: absolute(`/pokemon/${p.slug}`),
          primaryImageOfPage: artworkPng(p.id),
          about: { '@type': 'Thing', name: p.name, description: p.flavor, image: artworkPng(p.id) },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: site.name, item: absolute('/') },
              { '@type': 'ListItem', position: 2, name: `${titleCase(p.types[0])} type`, item: absolute(`/?type=${p.types[0]}`) },
              { '@type': 'ListItem', position: 3, name: p.name, item: absolute(`/pokemon/${p.slug}`) },
            ],
          },
        }}
      />

      <section className={styles.hero}>
        {/* Decoration: dot texture, the number in outline, floating sparks */}
        <div className={styles.backdrop} aria-hidden="true">
          <span className={styles.dots} />
          <span className={styles.bigNumber}>{String(p.id).padStart(4, '0')}</span>
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className={styles.spark} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.art}>
            <svg className={styles.rings} viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="190" className={styles.ringDash} />
              <circle cx="200" cy="200" r="150" className={styles.ringThin} />
              <circle cx="200" cy="200" r="112" className={styles.ringDash2} />
            </svg>
            <span className={styles.glow} aria-hidden="true" />
            <Image
              src={artwork(p.id)}
              className={`artwork ${styles.artImage}`}
              alt={`Official artwork of ${p.name}`}
              width={475}
              height={475}
              priority
              quality={90}
              sizes="(max-width: 860px) 60vw, 320px"
            />
            <span className={styles.shadow} aria-hidden="true" />
          </div>

          <div className={styles.intro}>
            <p className={`${styles.number} ${styles.rise}`}>
              {dexNumber(p.id)}
              {(p.legendary || p.mythical) && <span className={styles.special}>{p.mythical ? 'Mythical' : 'Legendary'}</span>}
            </p>
            <h1 className={`display ${styles.name} ${styles.rise}`}>{p.name}</h1>
            <p className={`${styles.genus} ${styles.rise}`}>{p.genus}</p>
            <div className={`${styles.types} ${styles.rise}`}>
              {p.types.map((t) => (
                <TypeBadge key={t} type={t} size="lg" />
              ))}
            </div>
            <p className={`${styles.flavor} ${styles.rise}`}>{p.flavor}</p>
            <dl className={`${styles.quick} ${styles.rise}`}>
              <div>
                <dt>Height</dt>
                <dd>{p.height.toFixed(1)} m</dd>
              </div>
              <div>
                <dt>Weight</dt>
                <dd>{p.weight.toFixed(1)} kg</dd>
              </div>
              <div>
                <dt>Base total</dt>
                <dd>{p.total}</dd>
              </div>
            </dl>
            <div className={styles.rise}>
              <CollectionButtons id={p.id} name={p.name} />
            </div>
          </div>
        </div>

        <nav className={`container ${styles.heroNav}`} aria-label="Previous and next Pokémon">
          {previous ? (
            <Link href={`/pokemon/${previous.slug}`} rel="prev" className={styles.navLink}>
              <Image src={artwork(previous.id)} className="artwork" alt="" width={40} height={40} />
              <span>
                <small>← {dexNumber(previous.id)}</small>
                {previous.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/pokemon/${next.slug}`} rel="next" className={`${styles.navLink} ${styles.navNext}`}>
              <span>
                <small>{dexNumber(next.id)} →</small>
                {next.name}
              </span>
              <Image src={artwork(next.id)} className="artwork" alt="" width={40} height={40} />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </section>

      <div className={`container ${styles.grid}`}>
        <section className={`${styles.panel} ${styles.wide}`} aria-labelledby="stats">
          <header className={styles.panelHead}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
              </svg>
            </span>
            <div>
              <h2 id="stats" className={`display ${styles.heading}`}>
                Base stats
              </h2>
              <p className={styles.note}>
                A total of <strong>{p.total}</strong>, higher than {totalPercentile(p.total)}% of all Pokémon.
              </p>
            </div>
            <Link href={`/compare?a=${p.slug}`} className={styles.compare}>
              Compare
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </header>
          <div className={styles.statsBody}>
            <StatRadar stats={p.stats} />
            <StatBars stats={p.stats} />
          </div>
        </section>

        <section className={styles.panel} aria-labelledby="profile">
          <header className={styles.panelHead}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
              </svg>
            </span>
            <div>
              <h2 id="profile" className={`display ${styles.heading}`}>
                Profile
              </h2>
              <p className={styles.note}>Origin, family and abilities.</p>
            </div>
          </header>
          <dl className={styles.facts}>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
              </svg>
              <dt>Generation</dt>
              <dd>
                <Link href={`/?gen=${p.generation}`}>
                  {gen?.roman} · {gen?.name}
                </Link>
              </dd>
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12V4h8l10 10-8 8z" />
                <circle cx="7.5" cy="8.5" r="1.5" />
              </svg>
              <dt>Category</dt>
              <dd>{p.genus.replace(/ Pokémon$/, '')}</dd>
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="6" cy="17" r="3" />
                <circle cx="18" cy="17" r="3" />
                <circle cx="12" cy="6" r="3" />
                <path d="M10.5 8.5 7.5 14.5M13.5 8.5l3 6" />
              </svg>
              <dt>Family</dt>
              <dd>{familySize(tree) === 1 ? 'Doesn’t evolve' : `${familySize(tree)} Pokémon`}</dd>
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.6 6.9L22 9.5l-5.6 4.8L18 22l-6-3.8L6 22l1.6-7.7L2 9.5l7.4-.6z" />
              </svg>
              <dt>Status</dt>
              <dd>{p.mythical ? 'Mythical' : p.legendary ? 'Legendary' : 'Standard'}</dd>
            </div>
          </dl>
          <ul className={styles.abilities}>
            {p.abilities.map((a) => (
              <li key={a.slug} className={a.hidden ? styles.hiddenAbility : undefined}>
                <span className={styles.abilityIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    {a.hidden ? <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /> : <path d="M12 2l2.6 6.9L22 9.5l-5.6 4.8L18 22l-6-3.8L6 22l1.6-7.7L2 9.5l7.4-.6z" />}
                  </svg>
                </span>
                <div>
                  <strong>
                    {abilities[a.slug]?.name ?? titleCase(a.slug)}
                    {a.hidden && <span className={styles.hidden}>Hidden ability</span>}
                  </strong>
                  <span>{abilities[a.slug]?.effect}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel} aria-labelledby="matchups">
          <header className={styles.panelHead}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
              </svg>
            </span>
            <div>
              <h2 id="matchups" className={`display ${styles.heading}`}>
                Type matchups
              </h2>
              <p className={styles.note}>Damage {p.name} takes from each type of attack.</p>
            </div>
          </header>
          <MatchupGrid profile={defenseProfile(p.types)} />
        </section>

        <section className={`${styles.panel} ${styles.wide}`} aria-labelledby="evolution">
          <header className={styles.panelHead}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 17c4 0 4-10 8-10s4 10 8 10M17 14l3 3-3 3" />
              </svg>
            </span>
            <div>
              <h2 id="evolution" className={`display ${styles.heading}`}>
                Evolution
              </h2>
              <p className={styles.note}>The whole family, and how each one evolves.</p>
            </div>
          </header>
          <EvolutionChain tree={tree} current={p.id} />
        </section>
      </div>
    </main>
  )
}
