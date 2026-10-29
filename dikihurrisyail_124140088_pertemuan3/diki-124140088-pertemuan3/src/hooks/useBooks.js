import { createContext, useContext } from 'react'

// Objek Context berisi state buku + aksi CRUD, beserta hook
// konsumennya. Dipasang di modul ini (bukan di file komponen) agar
// BookContext.jsx tetap hanya mengekspor komponen — sesuai aturan
// fast-refresh ESLint — dan tidak ada dua file berbedaa case
// (BookContext.jsx vs bookContext.js) yang bisa bertabrakan di
// filesystem Windows.
export const BookContext = createContext(null)

// Hook konsumen: dipakai semua halaman/komponen untuk membaca koleksi
// buku dan memanggil aksi CRUD dari provider.
export function useBooks() {
  const ctx = useContext(BookContext)
  if (ctx === null) {
    throw new Error('useBooks harus digunakan di dalam <BookProvider>.')
  }
  return ctx
}
