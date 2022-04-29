import React from 'react'
import PokemonId from './PokemonId'
import './PokemonCard.sass'

const PokemonCard = React.forwardRef(({ id, name, image, type }, ref) => (
  <div className="pokemon-card__wrapper">
    <div className="pokemon-card" ref={ref}>
      <img src={image} className="pokemon-card__image" alt="" />
      <div className="pokemon-card__name">
        {name} - <span className={`pokemon-card__type ${type}`}>{type}</span>
      </div>
      <PokemonId id={id} type={type} />
    </div>
  </div>
))

export default PokemonCard
