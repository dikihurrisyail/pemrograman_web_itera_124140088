import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { BookContext } from '../hooks/useBooks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useBookStats } from '../hooks/useBookStats'
import {
  BOOK_STORAGE_KEY,
  createBookId,
  sanitizeBooks,
  trimBookFields,
} from '../utils/bookHelpers'

// Provider koleksi buku. Satu sumber state bersama (list books) plus
// operasi CRUD yang menuliskannya ke localStorage. Hook konsumen-nya
// ada di modul terpisah (useBooks.js) agar file ini hanya mengekspor
// komponen (kewajiban fast-refresh ESLint).
export function BookProvider({ children }) {
  // Nilai awal kosong; jika ada data tersimpan, hook akan membacanya.
  const [books, setBooks] = useLocalStorage(BOOK_STORAGE_KEY, [])

  // Sanitasi dilakukan saat provider membuat nilai turunan agar data
  // rusak dari storage tidak bocor ke komponen.
  const safeBooks = useMemo(
    () => sanitizeBooks(books),
    [books],
  )

  const stats = useBookStats(safeBooks)

  const value = useMemo(() => {
    return {
      books: safeBooks,
      stats,
      addBook: (draft) => {
        // Timestamp dibuat saat operasi dilakukan.
        const now = new Date().toISOString()
        const book = {
          ...trimBookFields(draft),
          id: createBookId(),
          createdAt: now,
          updatedAt: now,
        }
        // functional update agar perubahan tidak kehilangan data lainnya.
        const persisted = setBooks((prev) => [...prev, book])
        if (!persisted) {
          // Simpan gagal (storage penuh/blok): kembalikan untuk dibersihkan
          // oleh layer UI, tetapi jangan beri kesan sukses ke pengguna.
          return { book, saved: false }
        }
        return { book, saved: true }
      },
      updateBook: (id, draft) => {
        const now = new Date().toISOString()
        const persisted = setBooks((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, ...trimBookFields(draft), updatedAt: now }
              : b,
          ),
        )
        return { saved: persisted }
      },
      deleteBook: (id) => {
        return setBooks((prev) => prev.filter((b) => b.id !== id))
      },
    }
  }, [safeBooks, stats, setBooks])

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  )
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default BookProvider
