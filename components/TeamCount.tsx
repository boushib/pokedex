'use client'

import { TEAM_SIZE, useCollection } from '@/lib/collection'

export function TeamCount() {
  const { team } = useCollection()
  return (
    <span aria-label={`${team.length} of ${TEAM_SIZE}`} style={{ color: 'var(--faint)', fontVariantNumeric: 'tabular-nums' }}>
      {team.length}/{TEAM_SIZE}
    </span>
  )
}
