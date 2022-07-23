import SearchIcon from '../../icons/Search'
import './SearchBox.sass'

interface Props {
  searchQuery: string
  onChange: (query: string) => void
  placeholder: string
}

const SearchBox = ({ searchQuery, onChange, placeholder }: Props) => {
  return (
    <div className="search-box">
      <input
        type="text"
        className="form-input form-input--search"
        value={searchQuery}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <SearchIcon size={20} />
    </div>
  )
}

export default SearchBox
