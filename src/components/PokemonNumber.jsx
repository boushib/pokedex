import './PokemonNumber.sass'

const PokemonNumber = ({ num }) => (
  <div className="pokemon__number">{`0${num}`.slice(-2)}</div>
)

export default PokemonNumber
