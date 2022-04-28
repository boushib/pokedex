import SearchIcon from '../icons/Search'
import './SearchBox.sass'

const SearchBox = ({ searchQuery, onChange, placeholder }) => {
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
