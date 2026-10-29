import PropTypes from 'prop-types'

// Kolom pencarian judul/penulis. Nilai input dikirim ke pemilik
// (Home) agar dapat dikombinasikan dengan filter status.
export function SearchInput({ value, onChange, id = 'search' }) {
  return (
    <div className="search-field">
      <label htmlFor={id} className="search-label">
        Cari buku
      </label>
      <input
        id={id}
        type="search"
        className="search-input"
        value={value}
        placeholder="Judul atau penulis"
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
}

export default SearchInput
