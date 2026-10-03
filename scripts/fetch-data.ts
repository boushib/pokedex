// Snapshots PokéAPI into data/*.json, so the site never calls the API at runtime (as its fair-use policy asks).
// Run with `pnpm data`. Uses the GraphQL endpoint: a few large queries instead of thousands of REST calls.

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta'
const EN = 9
const OUT = path.join(process.cwd(), 'data')

async function query<T>(q: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) })
    const json = (await res.json().catch(() => ({}))) as { data?: T; errors?: { message: string }[] }
    if (res.ok && json.data) return json.data
    if (attempt === 4) throw new Error(`PokéAPI answered ${res.status}: ${json.errors?.[0]?.message ?? 'no data'}`)
    await new Promise((r) => setTimeout(r, 2000 * attempt))
  }
}

/** Flavor text from the games has hard line breaks and form feeds */
const clean = (s = '') => s.replace(/[\n\f\r­]+/g, ' ').replace(/\s+/g, ' ').replace(/POKéMON/g, 'Pokémon').trim()

type RawSpecies = {
  id: number
  name: string
  generation_id: number
  is_legendary: boolean
  is_mythical: boolean
  evolution_chain_id: number
  evolves_from_species_id: number | null
  pokemon_v2_pokemonspeciesnames: { name: string; genus: string }[]
  pokemon_v2_pokemonspeciesflavortexts: { flavor_text: string }[]
  pokemon_v2_pokemonevolutions: {
    min_level: number | null
    min_happiness: number | null
    min_affection: number | null
    time_of_day: string
    pokemon_v2_evolutiontrigger: { name: string } | null
    pokemon_v2_item: { name: string } | null
    pokemonV2ItemByHeldItemId: { name: string } | null
    pokemon_v2_move: { name: string } | null
    pokemon_v2_location: { name: string } | null
  }[]
  pokemon_v2_pokemons: {
    height: number
    weight: number
    pokemon_v2_pokemontypes: { slot: number; pokemon_v2_type: { name: string } }[]
    pokemon_v2_pokemonstats: { base_stat: number; pokemon_v2_stat: { name: string } }[]
    pokemon_v2_pokemonabilities: { is_hidden: boolean; slot: number; pokemon_v2_ability: { name: string } }[]
  }[]
}

const SPECIES_FIELDS = `
  id name generation_id is_legendary is_mythical evolution_chain_id evolves_from_species_id
  pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: ${EN}}}) { name genus }
  pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: ${EN}}}, order_by: {version_id: desc}, limit: 1) { flavor_text }
  pokemon_v2_pokemonevolutions(limit: 1) {
    min_level min_happiness min_affection time_of_day
    pokemon_v2_evolutiontrigger { name }
    pokemon_v2_item { name }
    pokemonV2ItemByHeldItemId { name }
    pokemon_v2_move { name }
    pokemon_v2_location { name }
  }
  pokemon_v2_pokemons(where: {is_default: {_eq: true}}) {
    height weight
    pokemon_v2_pokemontypes(order_by: {slot: asc}) { slot pokemon_v2_type { name } }
    pokemon_v2_pokemonstats { base_stat pokemon_v2_stat { name } }
    pokemon_v2_pokemonabilities(order_by: {slot: asc}) { is_hidden slot pokemon_v2_ability { name } }
  }`

const STAT_KEYS: Record<string, string> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'spAttack',
  'special-defense': 'spDefense',
  speed: 'speed',
}

async function main() {
  mkdirSync(OUT, { recursive: true })

  // Species, in pages
  const species: RawSpecies[] = []
  for (let offset = 0; ; offset += 250) {
    const page = await query<{ pokemon_v2_pokemonspecies: RawSpecies[] }>(
      `{ pokemon_v2_pokemonspecies(order_by: {id: asc}, limit: 250, offset: ${offset}) { ${SPECIES_FIELDS} } }`,
    )
    species.push(...page.pokemon_v2_pokemonspecies)
    console.log(`species: ${species.length}`)
    if (page.pokemon_v2_pokemonspecies.length < 250) break
  }

  const pokemon = species.map((s) => {
    const form = s.pokemon_v2_pokemons[0]
    const names = s.pokemon_v2_pokemonspeciesnames[0]
    const evo = s.pokemon_v2_pokemonevolutions[0]
    const stats = Object.fromEntries(form.pokemon_v2_pokemonstats.map((st) => [STAT_KEYS[st.pokemon_v2_stat.name], st.base_stat]))
    return {
      id: s.id,
      slug: s.name,
      name: names?.name ?? s.name,
      genus: names?.genus ?? '',
      generation: s.generation_id,
      types: form.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
      stats,
      total: Object.values(stats).reduce((a, b) => a + b, 0),
      abilities: form.pokemon_v2_pokemonabilities.map((a) => ({ slug: a.pokemon_v2_ability.name, hidden: a.is_hidden })),
      // PokéAPI uses decimeters and hectograms
      height: form.height / 10,
      weight: form.weight / 10,
      legendary: s.is_legendary,
      mythical: s.is_mythical,
      chain: s.evolution_chain_id,
      evolvesFrom: s.evolves_from_species_id,
      evolution:
        s.evolves_from_species_id && evo
          ? {
              trigger: evo.pokemon_v2_evolutiontrigger?.name ?? null,
              level: evo.min_level,
              happiness: evo.min_happiness,
              affection: evo.min_affection,
              time: evo.time_of_day || null,
              item: evo.pokemon_v2_item?.name ?? null,
              heldItem: evo.pokemonV2ItemByHeldItemId?.name ?? null,
              move: evo.pokemon_v2_move?.name ?? null,
              location: evo.pokemon_v2_location?.name ?? null,
            }
          : null,
      flavor: clean(s.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text),
    }
  })

  // Which ones have vector artwork (the "dream-world" SVGs); the rest fall back to the official PNG
  const SVG = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world'
  const noVector: number[] = []
  for (let i = 0; i < pokemon.length; i += 25) {
    await Promise.all(
      pokemon.slice(i, i + 25).map(async (p) => {
        const res = await fetch(`${SVG}/${p.id}.svg`, { method: 'HEAD' })
        if (!res.ok) noVector.push(p.id)
      }),
    )
  }
  noVector.sort((a, b) => a - b)
  console.log(`vector artwork: ${pokemon.length - noVector.length}`)

  // Abilities used by those Pokémon
  const slugs = [...new Set(pokemon.flatMap((p) => p.abilities.map((a) => a.slug)))]
  const abilityData = await query<{
    pokemon_v2_ability: {
      name: string
      pokemon_v2_abilitynames: { name: string }[]
      pokemon_v2_abilityeffecttexts: { short_effect: string }[]
      pokemon_v2_abilityflavortexts: { flavor_text: string }[]
    }[]
  }>(`{ pokemon_v2_ability(where: {name: {_in: ${JSON.stringify(slugs)}}}) {
        name
        pokemon_v2_abilitynames(where: {language_id: {_eq: ${EN}}}) { name }
        pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: ${EN}}}) { short_effect }
        pokemon_v2_abilityflavortexts(where: {language_id: {_eq: ${EN}}}, order_by: {version_group_id: desc}, limit: 1) { flavor_text }
      } }`)
  const abilities = Object.fromEntries(
    abilityData.pokemon_v2_ability.map((a) => [
      a.name,
      {
        name: a.pokemon_v2_abilitynames[0]?.name ?? a.name,
        effect: clean(a.pokemon_v2_abilityeffecttexts[0]?.short_effect || a.pokemon_v2_abilityflavortexts[0]?.flavor_text),
      },
    ]),
  )
  console.log(`abilities: ${Object.keys(abilities).length}`)

  // The type chart: damage multiplier for each attacking type against each defending type
  const typeData = await query<{
    pokemon_v2_type: { id: number; name: string }[]
    pokemon_v2_typeefficacy: { damage_factor: number; damage_type_id: number; target_type_id: number }[]
  }>(`{ pokemon_v2_type(where: {id: {_lte: 18}}, order_by: {id: asc}) { id name }
        pokemon_v2_typeefficacy { damage_factor damage_type_id target_type_id } }`)
  const typeName = new Map(typeData.pokemon_v2_type.map((t) => [t.id, t.name]))
  const chart: Record<string, Record<string, number>> = {}
  for (const e of typeData.pokemon_v2_typeefficacy) {
    const attack = typeName.get(e.damage_type_id)
    const defend = typeName.get(e.target_type_id)
    if (!attack || !defend) continue
    chart[attack] ??= {}
    chart[attack][defend] = e.damage_factor / 100
  }
  console.log(`types: ${Object.keys(chart).length}`)

  writeFileSync(path.join(OUT, 'pokemon.json'), JSON.stringify(pokemon))
  writeFileSync(path.join(OUT, 'no-vector.json'), JSON.stringify(noVector) + '\n')
  writeFileSync(path.join(OUT, 'abilities.json'), JSON.stringify(abilities))
  writeFileSync(path.join(OUT, 'types.json'), JSON.stringify({ order: typeData.pokemon_v2_type.map((t) => t.name), chart }))
  writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify({ source: 'https://pokeapi.co', fetchedAt: new Date().toISOString(), count: pokemon.length }, null, 2) + '\n')
  console.log(`Wrote ${pokemon.length} Pokémon to data/`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
