import type { BrowseItem } from '@/components/Browser'

import { allPokemon, type Pokemon } from './pokemon'

/** The compact list client pages receive (search, filter and pick), without flavor text or abilities */
export const browseItems: BrowseItem[] = allPokemon.map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  types: p.types,
  generation: p.generation,
  total: p.total,
  special: p.legendary || p.mythical,
}))

export type CompareItem = BrowseItem & { stats: Pokemon['stats']; height: number; weight: number }

/** For the compare view: the browse list plus stats and size */
export const compareItems: CompareItem[] = allPokemon.map((p, i) => ({ ...browseItems[i], stats: p.stats, height: p.height, weight: p.weight }))
