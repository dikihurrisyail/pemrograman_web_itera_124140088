import PropTypes from 'prop-types'
import BookCard from './BookCard'
import EmptyState from '../common/EmptyState'

// Daftar buku. Kondisi kosong dibedakan oleh pemilik lewat prop:
// koleksi benar-benar kosong vs. pencarian/filter yang tidak cocok.
export function BookList({
  books,
  collectionIsEmpty,
  onEdit,
  onDelete,
  onAddFirst,
}) {
  if (books.length === 0) {
    const emptyMessage = collectionIsEmpty
      ? 'Belum ada buku di koleksi Anda.'
      : 'Tidak ada buku yang cocok dengan pencarian atau filter Anda.'
    return (
      <EmptyState
        message={emptyMessage}
        action={collectionIsEmpty ? onAddFirst : undefined}
        actionLabel="Tambah buku pertama"
      />
    )
  }

  return (
    <ul className="book-list" aria-label="Daftar buku">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  collectionIsEmpty: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddFirst: PropTypes.func,
}

export default BookList
