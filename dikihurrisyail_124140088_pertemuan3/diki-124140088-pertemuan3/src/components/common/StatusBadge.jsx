import PropTypes from 'prop-types'
import { STATUS_LABELS } from '../../utils/bookHelpers'

// Label status buku dalam bentuk badge kecil. Membedakan tiap status
// lewat warna + teks (tidak hanya warna), agar tetap dapat dibaca
// oleh pengguna dengan buta warna.
export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.keys(STATUS_LABELS)).isRequired,
}

export default StatusBadge
