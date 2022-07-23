import './PokemonId.sass'

interface Props {
  id: number
  type: string
}

const PokemonId = ({ id, type }: Props) => (
  <div className={`pokemon-id pokemon-id--${type}`}>{`0${id}`.slice(-2)}</div>
)

export default PokemonId
