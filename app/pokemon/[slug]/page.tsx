import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CollectionButtons } from '@/components/CollectionButtons'
import { EvolutionChain } from '@/components/EvolutionChain'
import { JsonLd } from '@/components/JsonLd'
import { StatBars } from '@/components/StatBars'
import { TypeBadge } from '@/components/TypeBadge'
import { evolutionTree } from '@/lib/evolution'
import { abilities, allPokemon, artwork, artworkPng, dexNumber, GENERATIONS, getPokemon, neighbours, titleCase } from '@/lib/pokemon'
import { absolute, site } from '@/lib/site'
import { formatMultiplier, matchups, TYPE_COLORS } from '@/lib/types'

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
  const m = matchups(p.types)
  const tree = evolutionTree(p)
  const gen = GENERATIONS.find((g) => g.id === p.generation)
  const color = TYPE_COLORS[p.types[0]]

  return (
    <main style={{ '--type': color } as React.CSSProperties}>
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
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.art}>
            {/* SVGs skip optimization anyway; for the PNG fallback, re-encoding bands the artwork's soft shading */}
            <Image src={artwork(p.id)} className="artwork" alt={`Official artwork of ${p.name}`} width={475} height={475} priority unoptimized />
          </div>
          <div className={styles.intro}>
            <p className={styles.number}>
              {dexNumber(p.id)}
              {(p.legendary || p.mythical) && <span className={styles.special}>{p.mythical ? 'Mythical' : 'Legendary'}</span>}
            </p>
            <h1 className={`display ${styles.name}`}>{p.name}</h1>
            <p className={styles.genus}>{p.genus}</p>
            <div className={styles.types}>
              {p.types.map((t) => (
                <TypeBadge key={t} type={t} size="lg" />
              ))}
            </div>
            <p className={styles.flavor}>{p.flavor}</p>
            <CollectionButtons id={p.id} name={p.name} />
          </div>
        </div>
      </section>

      <div className={`container ${styles.grid}`}>
        <section className={`card ${styles.panel}`} aria-labelledby="profile">
          <h2 id="profile" className={`display ${styles.heading}`}>
            Profile
          </h2>
          <dl className={styles.facts}>
            <div>
              <dt>Height</dt>
              <dd>{p.height.toFixed(1)} m</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{p.weight.toFixed(1)} kg</dd>
            </div>
            <div>
              <dt>Generation</dt>
              <dd>
                <Link href={`/?gen=${p.generation}`}>
                  {gen?.roman} ({gen?.name})
                </Link>
              </dd>
            </div>
          </dl>
          <h3 className={styles.sub}>Abilities</h3>
          <ul className={styles.abilities}>
            {p.abilities.map((a) => (
              <li key={a.slug}>
                <strong>
                  {abilities[a.slug]?.name ?? titleCase(a.slug)}
                  {a.hidden && <span className={styles.hidden}>Hidden</span>}
                </strong>
                <span>{abilities[a.slug]?.effect}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`card ${styles.panel}`} aria-labelledby="stats">
          <h2 id="stats" className={`display ${styles.heading}`}>
            Base stats
          </h2>
          <StatBars stats={p.stats} total={p.total} />
          <Link href={`/compare?a=${p.slug}`} className={styles.compare}>
            Compare {p.name} with another Pokémon
          </Link>
        </section>

        <section className={`card ${styles.panel} ${styles.wide}`} aria-labelledby="matchups">
          <h2 id="matchups" className={`display ${styles.heading}`}>
            Type matchups
          </h2>
          <p className={styles.note}>How much damage {p.name} takes from each type of attack.</p>
          <div className={styles.matchups}>
            {[
              { title: 'Weak to', list: m.weak },
              { title: 'Resists', list: m.resist },
              { title: 'Immune to', list: m.immune },
            ].map((group) => (
              <div key={group.title}>
                <h3 className={styles.sub}>{group.title}</h3>
                {group.list.length === 0 ? (
                  <p className={styles.none}>Nothing</p>
                ) : (
                  <ul className={styles.chips}>
                    {group.list.map((x) => (
                      <li key={x.type}>
                        <TypeBadge type={x.type} />
                        <span className={styles.mult}>{formatMultiplier(x.multiplier)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={`card ${styles.panel} ${styles.wide}`} aria-labelledby="evolution">
          <h2 id="evolution" className={`display ${styles.heading}`}>
            Evolution
          </h2>
          <EvolutionChain tree={tree} current={p.id} />
        </section>
      </div>

      <nav className={`container ${styles.pager}`} aria-label="Previous and next Pokémon">
        {previous ? (
          <Link href={`/pokemon/${previous.slug}`} rel="prev">
            <span>← {dexNumber(previous.id)}</span>
            <strong>{previous.name}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/pokemon/${next.slug}`} rel="next" className={styles.next}>
            <span>{dexNumber(next.id)} →</span>
            <strong>{next.name}</strong>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
