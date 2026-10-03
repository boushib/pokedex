'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { TEAM_SIZE, useCollection } from '@/lib/collection'
import { artwork, dexNumber, titleCase } from '@/lib/pokemon'
import { defenseProfile, TYPES } from '@/lib/types'

import type { BrowseItem } from './Browser'
import { PokemonPicker } from './PokemonPicker'
import styles from './TeamBuilder.module.scss'
import { TypeBadge } from './TypeBadge'

export function TeamBuilder({ items }: { items: BrowseItem[] }) {
  const c = useCollection()
  const params = useSearchParams()
  const [copied, setCopied] = useState(false)
  const byId = new Map(items.map((p) => [p.id, p]))

  // A team shared by link: show it, and offer to keep it
  const shared = (params.get('ids') ?? '')
    .split(',')
    .map(Number)
    .filter((id) => byId.has(id))
    .slice(0, TEAM_SIZE)
  const viewingShared = shared.length > 0 && shared.join() !== c.team.join()
  const ids = viewingShared ? shared : c.team
  const team = ids.map((id) => byId.get(id)!)

  // For each attacking type: how many members take extra damage, and how many shrug it off
  const coverage = TYPES.map((type) => {
    const ms = team.map((p) => defenseProfile(p.types).find((d) => d.type === type)!.multiplier)
    return { type, weak: ms.filter((m) => m > 1).length, resist: ms.filter((m) => m < 1).length }
  })
  const threats = coverage.filter((x) => x.weak >= 2 && x.weak > x.resist).sort((a, b) => b.weak - a.weak)

  const share = async () => {
    await navigator.clipboard.writeText(`${location.origin}/team?ids=${ids.join(',')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div>
      {viewingShared && (
        <div className={styles.banner}>
          <span>You’re looking at a shared team.</span>
          <button
            className="btn btn-brand"
            onClick={() => {
              c.clearTeam()
              shared.forEach((id) => c.toggleTeam(id))
            }}
          >
            Save it as my team
          </button>
        </div>
      )}

      <ul className={styles.slots}>
        {Array.from({ length: TEAM_SIZE }, (_, i) => team[i]).map((p, i) =>
          p ? (
            <li key={p.id} className={styles.slot}>
              <Link href={`/pokemon/${p.slug}`} className={styles.member}>
                <Image src={artwork(p.id)} alt="" width={120} height={120} />
                <span className={styles.num}>{dexNumber(p.id)}</span>
                <strong>{p.name}</strong>
                <span className={styles.types}>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" link={false} />
                  ))}
                </span>
              </Link>
              {!viewingShared && (
                <button className={styles.remove} onClick={() => c.toggleTeam(p.id)} aria-label={`Remove ${p.name} from your team`}>
                  ×
                </button>
              )}
            </li>
          ) : (
            <li key={`empty-${i}`} className={`${styles.slot} ${styles.empty}`}>
              <span aria-hidden="true">+</span>
              Empty slot
            </li>
          ),
        )}
      </ul>

      {!viewingShared && (
        <div className={styles.toolbar}>
          <div className={styles.add}>
            {c.teamFull ? (
              <p className={styles.full}>Your team is full. Remove a Pokémon to add another.</p>
            ) : (
              <PokemonPicker items={items} exclude={c.team} placeholder="Add a Pokémon by name or number" onPick={(p) => c.toggleTeam(p.id)} />
            )}
          </div>
          {team.length > 0 && (
            <>
              <button className="btn btn-outline" onClick={share}>
                {copied ? 'Link copied' : 'Share team'}
              </button>
              <button className="btn btn-ghost" onClick={c.clearTeam}>
                Clear
              </button>
            </>
          )}
        </div>
      )}

      {team.length > 0 && (
        <section className={`card ${styles.analysis}`} aria-labelledby="coverage">
          <h2 id="coverage" className={`display ${styles.heading}`}>
            Defensive coverage
          </h2>
          <p className={styles.note}>
            {threats.length
              ? `Watch out for ${threats.map((t) => titleCase(t.type)).join(', ')}: ${threats.length === 1 ? 'it hits' : 'they hit'} several of your Pokémon hard.`
              : 'No attacking type hits more of your team hard than it resists. Nicely balanced.'}
          </p>
          <div className={styles.table}>
            {coverage.map((x) => (
              <div key={x.type} className={styles.cell}>
                <TypeBadge type={x.type} size="sm" link={false} />
                <span className={x.weak >= 2 ? styles.bad : x.weak ? styles.meh : styles.zero}>{x.weak} weak</span>
                <span className={x.resist ? styles.good : styles.zero}>{x.resist} resist</span>
              </div>
            ))}
          </div>
          <p className={styles.total}>
            Combined base stats: <strong>{team.reduce((s, p) => s + p.total, 0).toLocaleString()}</strong>
          </p>
        </section>
      )}
    </div>
  )
}
