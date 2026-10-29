import { useState } from 'react'
import PropTypes from 'prop-types'
import { BOOK_STATUSES, STATUS_LABELS, validateBookDraft } from '../../utils/bookHelpers'

// Form tambah/edit buku. Dipakai dalam dua mode:
// - tambah: book = null
// - edit:   book berisi data yang sedang disunting
// Nilai awal field diinisialisasi dari props saat mount; pemilik
// (Home) memakai key agar komponen di-mount ulang saat ganti buku,
// sehingga tidak perlu memaksa reset lewat useEffect.
// Field yang sudah benar tidak perlu diisi ulang setelah validasi
// gagal karena nilai disimpan di state komponen.
export function BookForm({ book = null, onSubmit, onCancel }) {
  const [draft, setDraft] = useState({
    title: book?.title ?? '',
    author: book?.author ?? '',
    status: book?.status ?? '',
  })
  const [errors, setErrors] = useState({})
  // Pesan feedback operasi (mis. penyimpanan gagal) ditampilkan setelah
  // submit agar pengguna tahu data tidak tersimpan.
  const [storageError, setStorageError] = useState(false)

  const handleChange = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()

    const fieldErrors = validateBookDraft(draft)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) {
      return
    }

    const result = onSubmit(draft)
    // Context melapor apakah data benar-benar tersimpan; bila gagal,
    // tampilkan pesan dan jangan rayakan keberhasilan.
    if (result && result.saved === false) {
      setStorageError(true)
    }
  }

  const isEditMode = book !== null

  return (
    <form className="book-form" onSubmit={handleFormSubmit} noValidate>
      <h2 className="form-title">
        {isEditMode ? `Edit: ${book.title}` : 'Tambah Buku'}
      </h2>

      {storageError && (
        <p className="form-feedback form-feedback--error" role="alert">
          Gagal menyimpan ke penyimpanan lokal. Periksa kuota penyimpanan
          lalu coba lagi.
        </p>
      )}

      <div className="form-field">
        <label htmlFor="book-title" className="form-label">
          Judul
        </label>
        <input
          id="book-title"
          type="text"
          className="form-input"
          value={draft.title}
          onChange={handleChange('title')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'book-title-error' : undefined}
        />
        {errors.title && (
          <p id="book-title-error" className="field-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="book-author" className="form-label">
          Penulis
        </label>
        <input
          id="book-author"
          type="text"
          className="form-input"
          value={draft.author}
          onChange={handleChange('author')}
          aria-invalid={Boolean(errors.author)}
          aria-describedby={errors.author ? 'book-author-error' : undefined}
        />
        {errors.author && (
          <p id="book-author-error" className="field-error" role="alert">
            {errors.author}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="book-status" className="form-label">
          Status
        </label>
        <select
          id="book-status"
          className="form-input form-select"
          value={draft.status}
          onChange={handleChange('status')}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? 'book-status-error' : undefined}
        >
          <option value="" disabled>
            Pilih status
          </option>
          {BOOK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        {errors.status && (
          <p id="book-status-error" className="field-error" role="alert">
            {errors.status}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export default BookForm
