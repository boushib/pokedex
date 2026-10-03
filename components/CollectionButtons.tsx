'use client'

import { useState } from 'react'

import { TEAM_SIZE, useCollection } from '@/lib/collection'

import styles from './CollectionButtons.module.scss'

/** Favorite and add-to-team, saved in this browser */
export function CollectionButtons({ id, name }: { id: number; name: string }) {
  const c = useCollection()
  const [note, setNote] = useState<string | null>(null)
  const fav = c.isFavorite(id)
  const inTeam = c.inTeam(id)

  const team = () => {
    if (!c.toggleTeam(id)) {
      setNote(`Your team already has ${TEAM_SIZE} Pokémon. Remove one first.`)
      setTimeout(() => setNote(null), 2600)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <button className={`btn ${inTeam ? 'btn-outline' : 'btn-brand'}`} onClick={team} aria-pressed={inTeam}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            {inTeam ? (
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </svg>
          {inTeam ? 'On your team' : 'Add to team'}
        </button>
        <button className={`btn btn-outline ${fav ? styles.fav : ''}`} onClick={() => c.toggleFavorite(id)} aria-pressed={fav} aria-label={fav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10"
              fill={fav ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          </svg>
          {fav ? 'Favorite' : 'Favorite'}
        </button>
      </div>
      {note && (
        <p className={styles.note} role="status">
          {note}
        </p>
      )}
    </div>
  )
}
