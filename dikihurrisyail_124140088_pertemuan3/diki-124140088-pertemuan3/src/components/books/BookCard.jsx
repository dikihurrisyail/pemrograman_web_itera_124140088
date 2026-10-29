import PropTypes from 'prop-types'
import StatusBadge from '../common/StatusBadge'

// Kartu satu entri buku: judul, penulis, status, dan aksi
// (edit + hapus). Disusun ulang lewat aksi pada kartu.
export function BookCard({ book, onEdit, onDelete }) {
  const handleDelete = (event) => {
    event.stopPropagation()
    onDelete(book)
  }

  return (
    <article className="book-card">
      <div className="book-card-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">{book.author}</p>
      </div>
      <StatusBadge status={book.status} />
      <div className="book-card-actions">
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={() => onEdit(book)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger btn--small"
          onClick={handleDelete}
          aria-label={`Hapus ${book.title}`}
        >
          Hapus
        </button>
      </div>
    </article>
  )
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default BookCard
