import abilitiesJson from '@/data/abilities.json'
import pokemonJson from '@/data/pokemon.json'

import type { StatKey } from './format'

// The formatting helpers live in ./format so client components can use them without the whole snapshot
export * from './format'

export type Evolution = {
  trigger: string | null
  level: number | null
  happiness: number | null
  affection: number | null
  time: string | null
  item: string | null
  heldItem: string | null
  move: string | null
  location: string | null
}

export type Pokemon = {
  id: number
  slug: string
  name: string
  genus: string
  generation: number
  types: string[]
  stats: Record<StatKey, number>
  total: number
  abilities: { slug: string; hidden: boolean }[]
  /** Meters */
  height: number
  /** Kilograms */
  weight: number
  legendary: boolean
  mythical: boolean
  chain: number
  evolvesFrom: number | null
  evolution: Evolution | null
  flavor: string
}

export const allPokemon = pokemonJson as Pokemon[]
export const abilities = abilitiesJson as Record<string, { name: string; effect: string }>

const bySlug = new Map(allPokemon.map((p) => [p.slug, p]))
const byId = new Map(allPokemon.map((p) => [p.id, p]))

export const getPokemon = (slug: string) => bySlug.get(slug) ?? null
export const getPokemonById = (id: number) => byId.get(id) ?? null

export const neighbours = (p: Pokemon) => ({ previous: getPokemonById(p.id - 1), next: getPokemonById(p.id + 1) })
