import typesJson from '@/data/types.json'

const data = typesJson as { order: string[]; chart: Record<string, Record<string, number>> }

export const TYPES = data.order

/** How much damage an attack of one type does to a single defending type */
export const effectiveness = (attack: string, defend: string) => data.chart[attack]?.[defend] ?? 1

/** Multipliers for every attacking type against a Pokémon with these types (dual types multiply) */
export function defenseProfile(types: string[]) {
  return TYPES.map((attack) => ({ type: attack, multiplier: types.reduce((m, defend) => m * effectiveness(attack, defend), 1) }))
}

/** Grouped for display: 4×, 2×, ½×, ¼×, 0× */
export function matchups(types: string[]) {
  const profile = defenseProfile(types)
  const pick = (test: (m: number) => boolean) => profile.filter((p) => test(p.multiplier))
  return {
    weak: pick((m) => m > 1).sort((a, b) => b.multiplier - a.multiplier),
    resist: pick((m) => m > 0 && m < 1).sort((a, b) => a.multiplier - b.multiplier),
    immune: pick((m) => m === 0),
  }
}

/** ×2, ×½, ×¼ */
export const formatMultiplier = (m: number) => (m === 0.5 ? '½' : m === 0.25 ? '¼' : String(m)) + '×'

/** Each type's color, used for chips, card tints and stat bars */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#9fa19f',
  fire: '#e8613c',
  water: '#3d8fe0',
  grass: '#4caf50',
  electric: '#f2c12e',
  ice: '#4fc3d8',
  fighting: '#d0533a',
  poison: '#9b5ac2',
  ground: '#b8894a',
  flying: '#7fa6e8',
  psychic: '#e9628a',
  bug: '#93a32b',
  rock: '#b0a170',
  ghost: '#6c5aa6',
  dragon: '#5a63d6',
  dark: '#5b5250',
  steel: '#6f9bb2',
  fairy: '#e687d0',
}
