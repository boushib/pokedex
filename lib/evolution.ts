import { allPokemon, type Evolution, type Pokemon, titleCase } from './pokemon'

export type EvolutionNode = { pokemon: Pokemon; how: string | null; next: EvolutionNode[] }

/** "Level 16", "Use a Water Stone", "Level up with high friendship at night"… */
export function describeEvolution(e: Evolution | null): string | null {
  if (!e) return null
  const parts: string[] = []
  switch (e.trigger) {
    case 'level-up':
      if (e.level) parts.push(`Level ${e.level}`)
      else parts.push('Level up')
      if (e.happiness) parts.push('with high friendship')
      if (e.affection) parts.push('with high affection')
      if (e.move) parts.push(`knowing ${titleCase(e.move)}`)
      if (e.heldItem) parts.push(`holding a ${titleCase(e.heldItem)}`)
      if (e.location) parts.push(`at ${titleCase(e.location)}`)
      break
    case 'use-item':
      parts.push(e.item ? `Use a ${titleCase(e.item)}` : 'Use an item')
      break
    case 'trade':
      parts.push(e.heldItem ? `Trade holding a ${titleCase(e.heldItem)}` : 'Trade')
      break
    default:
      parts.push(e.trigger ? titleCase(e.trigger) : 'Special condition')
  }
  if (e.time) parts.push(e.time === 'day' ? 'during the day' : `at ${e.time}`)
  return parts.join(' ')
}

/** The whole family tree a Pokémon belongs to, from its base form */
export function evolutionTree(pokemon: Pokemon): EvolutionNode {
  const family = allPokemon.filter((p) => p.chain === pokemon.chain)
  const build = (p: Pokemon): EvolutionNode => ({
    pokemon: p,
    how: describeEvolution(p.evolution),
    next: family.filter((c) => c.evolvesFrom === p.id).map(build),
  })
  const root = family.find((p) => !p.evolvesFrom || !family.some((f) => f.id === p.evolvesFrom)) ?? pokemon
  return build(root)
}

export const familySize = (node: EvolutionNode): number => 1 + node.next.reduce((n, c) => n + familySize(c), 0)
