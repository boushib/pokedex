import { describe, expect, it } from 'vitest'

import { describeEvolution, evolutionTree, familySize } from '@/lib/evolution'
import { abilities, allPokemon, artwork, dexNumber, getPokemon, titleCase } from '@/lib/pokemon'
import { effectiveness, formatMultiplier, matchups, TYPES } from '@/lib/types'

describe('the snapshot', () => {
  it('has every Pokémon in order with complete data', () => {
    expect(allPokemon).toHaveLength(1025)
    allPokemon.forEach((p, i) => {
      expect(p.id).toBe(i + 1)
      expect(p.types.length).toBeGreaterThan(0)
      expect(p.total).toBe(Object.values(p.stats).reduce((a, b) => a + b, 0))
      for (const a of p.abilities) expect(abilities[a.slug]).toBeDefined()
    })
  })

  it('formats numbers, slugs and artwork links', () => {
    expect(dexNumber(25)).toBe('#0025')
    expect(titleCase('water-stone')).toBe('Water Stone')
    expect(artwork(25)).toMatch(/dream-world\/25\.svg$/)
    expect(artwork(905)).toMatch(/official-artwork\/905\.png$/)
  })
})

describe('type matchups', () => {
  it('knows single-type multipliers', () => {
    expect(TYPES).toHaveLength(18)
    expect(effectiveness('fire', 'grass')).toBe(2)
    expect(effectiveness('normal', 'ghost')).toBe(0)
  })

  it('multiplies dual types: Charizard takes 4× from Rock and nothing from Ground', () => {
    const m = matchups(getPokemon('charizard')!.types)
    expect(m.weak[0]).toEqual({ type: 'rock', multiplier: 4 })
    expect(m.immune.map((x) => x.type)).toEqual(['ground'])
    expect(m.resist.find((x) => x.type === 'grass')?.multiplier).toBe(0.25)
  })

  it('formats multipliers', () => {
    expect([4, 2, 0.5, 0.25, 0].map(formatMultiplier)).toEqual(['4×', '2×', '½×', '¼×', '0×'])
  })
})

describe('evolutions', () => {
  it('builds Eevee’s branching family from any member', () => {
    const tree = evolutionTree(getPokemon('umbreon')!)
    expect(tree.pokemon.slug).toBe('eevee')
    expect(tree.next.length).toBe(8)
    expect(familySize(tree)).toBe(9)
  })

  it('describes how each one evolves', () => {
    expect(describeEvolution(getPokemon('ivysaur')!.evolution)).toBe('Level 16')
    expect(describeEvolution(getPokemon('vaporeon')!.evolution)).toBe('Use a Water Stone')
    expect(describeEvolution(getPokemon('umbreon')!.evolution)).toBe('Level up with high friendship at night')
    expect(describeEvolution(getPokemon('bulbasaur')!.evolution)).toBeNull()
  })
})
