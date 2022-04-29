import PokemonId from './PokemonId'
import './PokemonCard.sass'

const PokemonCard = ({ id, name, image, type }) => (
  <div className="pokemon-card">
    <img src={image} className="pokemon-card__image" alt="" />
    <div className="pokemon-card__name">
      {name} - <span className={`pokemogn-card__type ${type}`}>{type}</span>
    </div>
    <PokemonId id={id} type={type} />
  </div>
)

export default PokemonCard
