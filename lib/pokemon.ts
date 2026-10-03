import abilitiesJson from '@/data/abilities.json'
import pokemonJson from '@/data/pokemon.json'

export type StatKey = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed'

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

export const STATS: { key: StatKey; label: string; short: string }[] = [
  { key: 'hp', label: 'HP', short: 'HP' },
  { key: 'attack', label: 'Attack', short: 'Atk' },
  { key: 'defense', label: 'Defense', short: 'Def' },
  { key: 'spAttack', label: 'Sp. Attack', short: 'SpA' },
  { key: 'spDefense', label: 'Sp. Defense', short: 'SpD' },
  { key: 'speed', label: 'Speed', short: 'Spe' },
]

export const GENERATIONS = [
  { id: 1, name: 'Kanto', roman: 'I' },
  { id: 2, name: 'Johto', roman: 'II' },
  { id: 3, name: 'Hoenn', roman: 'III' },
  { id: 4, name: 'Sinnoh', roman: 'IV' },
  { id: 5, name: 'Unova', roman: 'V' },
  { id: 6, name: 'Kalos', roman: 'VI' },
  { id: 7, name: 'Alola', roman: 'VII' },
  { id: 8, name: 'Galar', roman: 'VIII' },
  { id: 9, name: 'Paldea', roman: 'IX' },
]

/** #0025 */
export const dexNumber = (id: number) => `#${String(id).padStart(4, '0')}`

/** Official artwork from the PokéAPI sprites repository */
export const artwork = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

/** "water-stone" → "Water Stone" */
export const titleCase = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export const neighbours = (p: Pokemon) => ({ previous: getPokemonById(p.id - 1), next: getPokemonById(p.id + 1) })
