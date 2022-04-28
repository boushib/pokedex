import { useEffect, useState } from 'react'
import api from './api'
import PokemonList from './components/PokemonList'

const App = () => {
  const [pokemons, setPokemons] = useState([])

  useEffect(() => {
    fetchPokemons()
  }, [])

  const fetchPokemons = async () => {
    const { data } = await api.get(`/pokemon?offset=0&limit=20`)
    const { count, results } = data
    setPokemons(results)
  }

  return (
    <div className="app">
      <PokemonList pokemons={pokemons} />
    </div>
  )
}

export default App
