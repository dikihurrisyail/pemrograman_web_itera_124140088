import { useMemo, useState } from 'react'
import { useBooks } from '../hooks/useBooks'
import BookForm from '../components/books/BookForm'
import BookList from '../components/books/BookList'
import BookFilter from '../components/books/BookFilter'
import SearchInput from '../components/books/SearchInput'
import ConfirmDialog from '../components/common/ConfirmDialog'
import {
  NO_FILTER,
  filterBooksByQuery,
  filterBooksByStatus,
} from '../utils/bookHelpers'

// Halaman beranda: pencarian, filter, daftar buku, form tambah/edit,
// dan konfirmasi hapus. State pencarian & filter lokal; koleksi selalu
// diambil dari Context sehingga sinkron dengan halaman lain.
export function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks()

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(NO_FILTER)
  const [formOpen, setFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [bookToConfirmDelete, setBookToConfirmDelete] = useState(null)

  // Cari & filter berurutan: hasil pencarian difilter statusnya.
  const visibleBooks = useMemo(() => {
    const searched = filterBooksByQuery(books, query)
    return filterBooksByStatus(searched, statusFilter)
  }, [books, query, statusFilter])

  const openAddForm = () => {
    setEditingBook(null)
    setFormOpen(true)
  }

  const openEditForm = (book) => {
    setEditingBook(book)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingBook(null)
  }

  // Submit form: tambah baru atau perbarui berdasarkan buku yang sedang
  // disunting, lalu tutup panel form. Hasil penyimpanan (termasuk gagal
  // persisten) diteruskan ke form agar feedback-nya akurat.
  const handleFormSubmit = (draft) => {
    const result = editingBook
      ? updateBook(editingBook.id, draft)
      : addBook(draft)
    closeForm()
    return result
  }

  const handleConfirmDelete = () => {
    if (bookToConfirmDelete) {
      deleteBook(bookToConfirmDelete.id)
    }
    setBookToConfirmDelete(null)
  }

  return (
    <div className="page home-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Koleksi Buku</h1>
          <p className="page-subtitle">
            {books.length > 0
              ? `${books.length} buku tercatat di koleksi Anda.`
              : 'Mulai catat buku pertama Anda.'}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openAddForm}>
          Tambah Buku
        </button>
      </header>

      {formOpen && (
        <section className="panel" aria-label={editingBook ? 'Edit buku' : 'Tambah buku'}>
          {/* key memaksa remount form saat buku yang disunting berganti,
              sehingga nilai awal field selalu mengikuti props terbaru. */}
          <BookForm
            key={editingBook ? `edit-${editingBook.id}` : 'add'}
            book={editingBook}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        </section>
      )}

      <section className="toolbar" aria-label="Pencarian dan filter">
        <SearchInput value={query} onChange={setQuery} />
        <BookFilter value={statusFilter} onChange={setStatusFilter} />
      </section>

      <BookList
        books={visibleBooks}
        collectionIsEmpty={books.length === 0}
        onEdit={openEditForm}
        onDelete={setBookToConfirmDelete}
        onAddFirst={openAddForm}
      />

      <ConfirmDialog
        open={bookToConfirmDelete !== null}
        title="Hapus buku?"
        message={
          bookToConfirmDelete
            ? `"${bookToConfirmDelete.title}" oleh ${bookToConfirmDelete.author} akan dihapus permanen.`
            : ''
        }
        confirmLabel="Hapus"
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToConfirmDelete(null)}
      />
    </div>
  )
}

Home.propTypes = {}

export default Home
