import { useEffect, useState } from 'react'
import api from './api'
import AppBar from './components/AppBar'
import Logo from './components/Logo'
import PokemonList from './components/PokemonList'
import SearchBox from './components/SearchBox'

const App = () => {
  const [pokemons, setPokemons] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPokemons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPokemons = async () => {
    const { data } = await api.get(`/pokemon?offset=0&limit=20`)
    const { results, count } = data
    const res = await Promise.all(
      results.map(r => api.get(`/pokemon/${r.name}`))
    )
    const pokemons = res.map(r => {
      const data = r.data
      console.log(data)
      const { id, name, types, sprites } = data
      const image = sprites.other.dream_world.front_default
      const type = types[0].type.name
      return { id, name, image, type }
    })
    setPokemons(pokemons)
  }

  return (
    <div className="app container">
      <AppBar>
        <Logo />
        <SearchBox
          searchQuery={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name..."
        />
      </AppBar>
      <PokemonList pokemons={pokemons} />
    </div>
  )
}

export default App
