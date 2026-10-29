// Utilitas buku: konstanta status, pembuat ID, pencarian, dan filter.
// Dipusatkan di sini agar tidak tersebar sebagai magic string di banyak komponen.

// Satu-satunya sumber daftar status valid. Dipakai oleh form, filter,
// dan validasi data dari storage.
export const BOOK_STATUSES = ['owned', 'reading', 'wishlist']

// Label berbahasa Indonesia untuk tiap status (PRD 4.1).
export const STATUS_LABELS = {
  owned: 'Dimiliki',
  reading: 'Sedang Dibaca',
  wishlist: 'Ingin Dibeli',
}

// `all` bukan status buku, hanya pilihan "tanpa filter".
export const NO_FILTER = 'all'

// Kunci penyimpanan untuk koleksi buku.
export const BOOK_STORAGE_KEY = 'book-app:books'

// Bersihkan input judul dan penulis: trim spasi berlebih sehingga
// spasi awal/akhir tidak tersimpan ke data.
export function trimBookFields(draft) {
  return {
    title: (draft.title ?? '').trim(),
    author: (draft.author ?? '').trim(),
    status: draft.status,
  }
}

// Buat ID unik dan stabil. crypto.randomUUID dipakai bila tersedia;
// fallback dipakai agar tetap berfungsi di environment yang tidak mendukungnya.
export function createBookId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `book-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// Riset data yang dibaca dari localStorage: hanya pertahankan array berisi
// objek dengan field wajib. Record yang tidak valid dibuang, bukan menyebabkan
// aplikasi error.
export function sanitizeBooks(data) {
  if (!Array.isArray(data)) {
    return []
  }
  return data.filter(
    (book) =>
      book &&
      typeof book.id === 'string' &&
      typeof book.title === 'string' &&
      typeof book.author === 'string' &&
      BOOK_STATUSES.includes(book.status),
  )
}

// Validasi input form. Mengembalikan objek pesan error per field yang
// bermasala; jika semua valid, hasilnya object kosong.
export function validateBookDraft({ title, author, status }) {
  const errors = {}
  if (!title || !title.trim()) {
    errors.title = 'Judul buku wajib diisi.'
  }
  if (!author || !author.trim()) {
    errors.author = 'Nama penulis wajib diisi.'
  }
  if (!BOOK_STATUSES.includes(status)) {
    errors.status = 'Status buku wajib dipilih.'
  }
  return errors
}

// Cari buku berdasarkan judul atau penulis: tanpa membedakan huruf besar
// dan kecil, mengabaikan spasi berlebih.
export function filterBooksByQuery(books, query) {
  const q = query.trim().toLowerCase()
  if (!q) {
    return books
  }
  return books.filter((book) => {
    const matchesTitle = book.title.trim().toLowerCase().includes(q)
    const matchesAuthor = book.author.trim().toLowerCase().includes(q)
    return matchesTitle || matchesAuthor
  })
}

// Filter berdasarkan status. `NO_FILTER` (string kosong) berarti semua buku.
export function filterBooksByStatus(books, status) {
  if (status === NO_FILTER) {
    return books
  }
  return books.filter((book) => book.status === status)
}
