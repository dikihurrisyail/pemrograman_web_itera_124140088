import PropTypes from 'prop-types'
import { BOOK_STATUSES, STATUS_LABELS, NO_FILTER } from '../../utils/bookHelpers'

// Filter status koleksi. Dipakai <select> agar accessible dan ringkas
// di layar sempit; nilai dikirim ke pemilik (Home).
export function BookFilter({ value, onChange }) {
  return (
    <div className="filter-field">
      <label htmlFor="status-filter" className="filter-label">
        Filter status
      </label>
      <select
        id="status-filter"
        className="filter-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value={NO_FILTER}>Semua Buku</option>
        {BOOK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  )
}

BookFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default BookFilter
