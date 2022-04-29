import PokemonCard from './PokemonCard'

const PokemonList = ({ pokemons }) => {
  return (
    <div className="pokemon-lis grid">
      {pokemons.map(({ name, image, id, type }) => (
        <PokemonCard name={name} image={image} id={id} type={type} key={name} />
      ))}
    </div>
  )
}

export default PokemonList
