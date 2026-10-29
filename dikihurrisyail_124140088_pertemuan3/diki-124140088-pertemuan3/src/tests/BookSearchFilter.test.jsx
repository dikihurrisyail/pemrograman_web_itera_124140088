import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import Home from '../pages/Home'
import { renderWithProvider, seedBooks, sampleBooks } from './testUtils'

describe('Home — pencarian, filter, dan edit/hapus', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('menemukan buku berdasarkan judul saat pencarian diketik', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    // Semuanya tampil di awal.
    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Cari buku'), {
      target: { value: 'sapi' },
    })

    expect(screen.queryByText('Laskar Pelangi')).toBeNull()
    expect(screen.queryByText('Atomic Habits')).toBeNull()
    expect(screen.getByText('Sapiens')).toBeInTheDocument()
  })

  it('menemukan buku berdasarkan penulis dengan pencarian tidak peka huruf', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    // Huruf kecil, dan tidak muncul padanan kata lain.
    fireEvent.change(screen.getByLabelText('Cari buku'), {
      target: { value: 'ANDREA' },
    })

    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
    expect(screen.queryByText('Atomic Habits')).toBeNull()
  })

  it('memfilter buku berdasarkan status', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    fireEvent.change(screen.getByLabelText('Filter status'), {
      target: { value: 'reading' },
    })

    expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
    expect(screen.queryByText('Laskar Pelangi')).toBeNull()
    expect(screen.queryByText('Sapiens')).toBeNull()
  })

  it('menggabungkan pencarian dan filter secara bersamaan', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    // Cari "buku" (tidak ada padanan), filter reading → tidak ada hasil.
    fireEvent.change(screen.getByLabelText('Cari buku'), {
      target: { value: 'harari' },
    })
    fireEvent.change(screen.getByLabelText('Filter status'), {
      target: { value: 'reading' },
    })

    // Sapiens memang wishlist, bukan reading → tidak muncul.
    expect(screen.queryByText('Sapiens')).toBeNull()
    expect(
      screen.getByText(/tidak ada buku yang cocok/i),
    ).toBeInTheDocument()
  })

  it('mengedit buku yang sudah ada', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    fireEvent.click(
      screen.getAllByRole('button', { name: /edit/i })[0],
    )

    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Laskar Pelangi (Edisi Baru)' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /simpan perubahan/i }),
    )

    expect(
      screen.getByText('Laskar Pelangi (Edisi Baru)'),
    ).toBeInTheDocument()

    // ID buku tidak berubah saat edit (integritas data).
    const stored = JSON.parse(window.localStorage.getItem('book-app:books'))
    const edited = stored.find((b) => b.id === 'seed-1')
    expect(edited.title).toBe('Laskar Pelangi (Edisi Baru)')
    expect(stored).toHaveLength(3)
  })

  it('menghapus buku setelah konfirmasi', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    // Buka dialog hapus pada buku pertama.
    fireEvent.click(screen.getByRole('button', { name: /hapus laskar/i }))
    fireEvent.click(screen.getByRole('button', { name: /^hapus$/i }))

    expect(screen.queryByText('Laskar Pelangi')).toBeNull()
    expect(screen.queryByText('Andrea Hirata')).toBeNull()
    // Buku lain tetap ada.
    expect(screen.getByText('Atomic Habits')).toBeInTheDocument()

    const stored = JSON.parse(window.localStorage.getItem('book-app:books'))
    expect(stored).toHaveLength(2)
  })

  it('tidak menghapus buku bila konfirmasi dibatalkan', () => {
    seedBooks(sampleBooks)
    renderWithProvider(<Home />)

    fireEvent.click(screen.getByRole('button', { name: /hapus laskar/i }))
    fireEvent.click(screen.getByRole('button', { name: /batal/i }))

    expect(screen.getByText('Laskar Pelangi')).toBeInTheDocument()
    const stored = JSON.parse(window.localStorage.getItem('book-app:books'))
    expect(stored).toHaveLength(3)
  })
})
