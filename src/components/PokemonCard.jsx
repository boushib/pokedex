import './PokemonCard.sass'

const PokemonCard = ({ name, id }) => (
  <div className="pokemon-card">
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      className="pokemon-card__image"
      alt=""
    />
    <div className="pokemon-card__name">{name}</div>
  </div>
)

export default PokemonCard
