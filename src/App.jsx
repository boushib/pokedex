import { useEffect, useState } from 'react'
import api from './api'
import PokemonList from './components/PokemonList'
import SearchBox from './components/SearchBox'

const App = () => {
  const [pokemons, setPokemons] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPokemons()
  }, [])

  const fetchPokemons = async () => {
    const { data } = await api.get(`/pokemon?offset=0&limit=20`)
    const {
      // count,
      results,
    } = data
    setPokemons(results)
  }

  return (
    <div className="app container">
      <SearchBox
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by name..."
      />
      <PokemonList pokemons={pokemons} />
    </div>
  )
}

export default App
