// Formatting and artwork helpers, free of the data snapshot so client components can import them cheaply

import noVectorJson from '@/data/no-vector.json'

export type StatKey = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed'

/** The few Pokémon without vector artwork in the sprites repository */
const noVector = new Set<number>(noVectorJson)

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

const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other'

/** Official artwork as a 475px PNG. Used where a raster is needed: share images and structured data */
export const artworkPng = (id: number) => `${SPRITES}/official-artwork/${id}.png`

/** Vector artwork, sharp at any size, for the Pokémon that have it; the PNG for the rest */
export const artwork = (id: number) => (noVector.has(id) ? artworkPng(id) : `${SPRITES}/dream-world/${id}.svg`)

/** "water-stone" → "Water Stone" */
export const titleCase = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
