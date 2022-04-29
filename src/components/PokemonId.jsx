import './PokemonId.sass'

const PokemonId = ({ id, type }) => (
  <div className={`pokemon-id pokemon-id--${type}`}>{`0${id}`.slice(-2)}</div>
)

export default PokemonId
