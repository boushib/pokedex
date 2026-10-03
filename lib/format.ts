// Formatting and artwork helpers, free of the data snapshot so client components can import them cheaply

export type StatKey = 'hp' | 'attack' | 'defense' | 'spAttack' | 'spDefense' | 'speed'

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

/** The official artwork in high resolution (mostly 1200px and up), named by Pokédex number, e.g. 0025.png. The image optimizer resizes it */
export const artwork = (id: number) => `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${String(id).padStart(4, '0')}.png`

/** The same artwork as a light 475px PNG from PokéAPI, for share images and structured data */
export const artworkPng = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

/** "water-stone" → "Water Stone" */
export const titleCase = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
