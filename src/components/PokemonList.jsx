import PokemonCard from './PokemonCard'

const PokemonList = ({ pokemons }) => {
  return (
    <div className="pokemon-lis grid">
      {pokemons.map(({ name, url }, i) => (
        <PokemonCard name={name} id={i + 1} key={name} />
      ))}
    </div>
  )
}

export default PokemonList
