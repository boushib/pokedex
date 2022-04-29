import { useCallback, useEffect, useRef, useState } from 'react'
import api from './api'
import AppBar from './components/AppBar'
import Logo from './components/Logo'
import PokemonCard from './components/PokemonCard'
import SearchBox from './components/SearchBox'

const ITEMS_PER_PAGE = 20

const App = () => {
  const [allPokemons, setAllPokemons] = useState([])
  const [pokemons, setPokemons] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [pagesTotal, setPagesTotal] = useState(0)
  const observer = useRef()
  const lastCardRef = useCallback(
    node => {
      if (!isLoading) {
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && page <= pagesTotal) {
            setPage(p => p + 1)
          }
        })

        if (node) observer.current.observe(node)
      }
    },
    [isLoading, pagesTotal, page]
  )

  useEffect(() => {
    if (page <= pagesTotal || pagesTotal === 0) {
      fetchPokemons()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    setPokemons(
      allPokemons.filter(pokemon => {
        return (
          pokemon.name.includes(searchQuery) ||
          pokemon.type.includes(searchQuery) ||
          pokemon.id.toString().includes(searchQuery)
        )
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const fetchPokemons = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get(
        `/pokemon?offset=${ITEMS_PER_PAGE * (page - 1)}&limit=${ITEMS_PER_PAGE}`
      )
      const { results, count } = data
      const res = await Promise.all(
        results.map(r => api.get(`/pokemon/${r.name}`))
      )
      const pokemonsData = res.map(r => {
        const data = r.data
        const { id, name, types, sprites } = data
        const image = sprites.other.dream_world.front_default
        const type = types[0].type.name
        return { id, name, image, type }
      })
      setPagesTotal(Math.ceil(count / ITEMS_PER_PAGE))
      setPokemons([...pokemons, ...pokemonsData])
      setAllPokemons(...pokemons, ...pokemonsData)
    } catch (error) {}
    setIsLoading(false)
  }

  return (
    <div className="app container">
      <AppBar>
        <Logo />
        <SearchBox
          searchQuery={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, type or Id..."
        />
      </AppBar>
      <div className="pokemon-list grid">
        {pokemons.map(({ name, image, id, type }, index) => (
          <PokemonCard
            name={name}
            image={image}
            id={id}
            type={type}
            ref={index + 1 === pokemons.length ? lastCardRef : undefined}
            key={name}
          />
        ))}
      </div>
    </div>
  )
}

export default App
