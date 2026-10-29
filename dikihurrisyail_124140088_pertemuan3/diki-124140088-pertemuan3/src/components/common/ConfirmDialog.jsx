import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

// Dialog konfirmasi untuk aksi destruktif (menghapus buku).
// Semantik alertdialog: ESC menutup, fokus awal di tombol "Batal".
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Hapus',
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    // Fokus diberikan ke tombol "Batal" (pilihan yang aman), bukan ke
    // tombol hapus, agar keyboard user tidak menghapus tanpa sengaja
    // hanya dengan menekan Enter saat dialog terbuka.
    cancelButtonRef.current?.focus()

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="dialog-overlay"
      role="presentation"
      onClick={(event) => {
        // Klik di luar dialog = batal, bukan hapus.
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <h2 id="confirm-dialog-title" className="dialog-title">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="dialog-message">
          {message}
        </p>
        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn--secondary"
            ref={cancelButtonRef}
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default ConfirmDialog
