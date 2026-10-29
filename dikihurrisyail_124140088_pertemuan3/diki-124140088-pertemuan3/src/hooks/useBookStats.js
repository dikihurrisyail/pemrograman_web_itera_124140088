import { useMemo } from 'react'
import { BOOK_STATUSES } from '../utils/bookHelpers'

// Hitung statistik koleksi dari daftar buku.
// Nilai dihitung dari data sumber (bukan state terpisah) sehingga selalu
// sinkron dengan perubahan koleksi. useMemo dipakai karena perhitungan
// dihindari ulang saat daftar buku tidak berubah.
export function useBookStats(books) {
  return useMemo(() => {
    const counts = { owned: 0, reading: 0, wishlist: 0 }
    for (const book of books) {
      if (BOOK_STATUSES.includes(book.status)) {
        counts[book.status] += 1
      }
    }
    const total = books.length

    // Persentase dibulatkan ke bilangan bulat; 0 bila koleksi kosong agar
    // tidak menghasilkan NaN.
    const percent = (n) => (total > 0 ? Math.round((n / total) * 100) : 0)

    return {
      total,
      owned: counts.owned,
      reading: counts.reading,
      wishlist: counts.wishlist,
      percentOwned: percent(counts.owned),
      percentReading: percent(counts.reading),
      percentWishlist: percent(counts.wishlist),
    }
  }, [books])
}
