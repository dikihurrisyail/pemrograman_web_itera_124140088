import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import Home from '../pages/Home'
import Stats from '../pages/Stats'
import { renderWithProvider, seedBooks, sampleBooks } from './testUtils'

describe('Halaman Statistik', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('menampilkan jumlah buku per status berdasarkan data aktual', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Stats />)

    // Total 3, masing-masing status 1 (33%).
    expect(screen.getByText('Total buku')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()

    expect(screen.getByText('Dimiliki')).toBeInTheDocument()
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument()
    expect(screen.getByText('Ingin Dibeli')).toBeInTheDocument()

    // Bar distribusi: setiap status 1 dari 3 buku = 33%.
    expect(screen.getAllByText('1 buku · 33%')).toHaveLength(3)
  })

  it('menampilkan zero-data state ketika koleksi kosong', () => {
    renderWithProvider(<Stats />)

    expect(screen.getByText('Belum ada buku')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /koleksi buku/i }),
    ).toBeInTheDocument()
  })
})

describe('Persistensi data', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('memuat ulang data tersimpan setelah komponen di-mount ulang (simulasi reload)', () => {
    // Render pertama: tambah buku baru lewat form.
    const { unmount } = renderWithProvider(<Home />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Tambah Buku' }),
    )
    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Kamus Kecil' },
    })
    fireEvent.change(screen.getByLabelText('Penulis'), {
      target: { value: 'P. A. Y.' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'owned' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^simpan$/i }))
    expect(screen.getByText('Kamus Kecil')).toBeInTheDocument()
    unmount()

    // Render kedua mensimulasikan halaman dimuat ulang:
    // komponen baru harus membaca data dari localStorage.
    renderWithProvider(<Home />)
    expect(screen.getByText('Kamus Kecil')).toBeInTheDocument()
    expect(screen.getByText('P. A. Y.')).toBeInTheDocument()
  })

  it('menangani data localStorage yang rusak tanpa membuat aplikasi berhenti', () => {
    // Simulasikan storage berisi JSON yang tidak valid.
    window.localStorage.setItem('book-app:books', '{bukan-json- VALID')

    renderWithProvider(<Home />)

    // Aplikasi tetap berjalan dengan kondisi kosong.
    expect(
      screen.getByText(/belum ada buku di koleksi/i),
    ).toBeInTheDocument()
  })

  it('menampilkan empty state yang menjelaskan langkah berikutnya', () => {
    renderWithProvider(<Home />)

    expect(
      screen.getByText(/belum ada buku di koleksi/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /tambah buku pertama/i }) ??
        screen.getByRole('button', { name: /tambah buku/i }),
    ).toBeInTheDocument()
  })
})
