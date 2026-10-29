import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import Home from '../pages/Home'
import { renderWithProvider } from './testUtils'

describe('Home — form tambah buku', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('menambahkan buku baru dengan input yang valid', () => {
    renderWithProvider(<Home />)

    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))

    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Bumi Tak Tidur' },
    })
    fireEvent.change(screen.getByLabelText('Penulis'), {
      target: { value: 'Makara Jaya' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'reading' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^simpan$/i }))

    expect(screen.getByText('Bumi Tak Tidur')).toBeInTheDocument()
    expect(screen.getByText('Makara Jaya')).toBeInTheDocument()
    // Badge status memakai label bahasa Indonesia.
    expect(
      screen.getByText('Sedang Dibaca', { selector: '.status-badge' }),
    ).toBeInTheDocument()

    // Data benar-benar ditulis ke localStorage.
    const stored = JSON.parse(window.localStorage.getItem('book-app:books'))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({
      title: 'Bumi Tak Tidur',
      author: 'Makara Jaya',
      status: 'reading',
    })
    expect(stored[0].id).toBeTruthy()
    expect(stored[0].createdAt).toBeTruthy()
  })

  it('menampilkan error ketika judul dan penulis kosong, dan tidak menyimpan', () => {
    renderWithProvider(<Home />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Tambah Buku' }),
    )
    // Klik simpan tanpa mengisi apa-apa.
    fireEvent.click(screen.getByRole('button', { name: /^simpan$/i }))

    expect(
      screen.getByText(/judul buku wajib diisi/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/nama penulis wajib diisi/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/status buku wajib dipilih/i),
    ).toBeInTheDocument()

    // Field bermasala ditandai dengan indikator visual (aria-invalid).
    expect(screen.getByLabelText('Judul')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Penulis')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Status')).toHaveAttribute('aria-invalid', 'true')

    // Tidak ada data yang tersimpan.
    expect(window.localStorage.getItem('book-app:books')).toBeNull()
  })

  it('menolak input yang hanya berisi spasi', () => {
    renderWithProvider(<Home />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Tambah Buku' }),
    )
    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: '   ' },
    })
    fireEvent.change(screen.getByLabelText('Penulis'), {
      target: { value: 'R. A. Kartini' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'owned' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^simpan$/i }))

    expect(
      screen.getByText(/judul buku wajib diisi/i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveAttribute('aria-invalid', 'true')
    expect(window.localStorage.getItem('book-app:books')).toBeNull()
  })

  it('mempertahankan input yang sudah benar setelah validasi gagal', () => {
    renderWithProvider(<Home />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Tambah Buku' }),
    )
    fireEvent.change(screen.getByLabelText('Judul'), {
      target: { value: 'Belum Ada Judul' },
    })
    fireEvent.change(screen.getByLabelText('Penulis'), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'owned' },
    })
    // Simpan: akan gagal karena penulis kosong.
    fireEvent.click(screen.getByRole('button', { name: /^simpan$/i }))

    // Input judul tidak hilang setelah kegagalan validasi.
    expect(screen.getByLabelText('Judul')).toHaveValue('Belum Ada Judul')
    expect(screen.getByLabelText('Status')).toHaveValue('owned')
  })
})
