import PokemonCard from './PokemonCard'
import './PokemonList.sass'

const PokemonList = ({ pokemons }) => {
  return (
    <div className="pokemon-list grid">
      {pokemons.map(({ name, image, id, type }) => (
        <PokemonCard name={name} image={image} id={id} type={type} key={name} />
      ))}
    </div>
  )
}

export default PokemonList
