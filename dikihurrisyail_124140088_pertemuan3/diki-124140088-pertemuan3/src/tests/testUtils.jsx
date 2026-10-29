import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BookProvider } from '../context/BookContext'

// Helper render standar: membungkus komponen dengan provider yang sama
// seperti di aplikasi (MemoryRouter menghindari dependensi pada URL
// nyata; BookProvider adalah sumber state buku).
export function renderWithProvider(ui) {
  const utils = render(
    <MemoryRouter>
      <BookProvider>{ui}</BookProvider>
    </MemoryRouter>,
  )
  return { ...utils, ...screen }
}

// Isi localStorage dengan koleksi tertentu SEBELUM komponen di-render,
// mensimulasikan pengguna yang sudah punya data tersimpan.
export function seedBooks(books) {
  window.localStorage.setItem(
    'book-app:books',
    JSON.stringify(books),
  )
}

// Contoh data buku untuk test.
export const sampleBooks = [
  {
    id: 'seed-1',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    status: 'owned',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'reading',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    status: 'wishlist',
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
]
