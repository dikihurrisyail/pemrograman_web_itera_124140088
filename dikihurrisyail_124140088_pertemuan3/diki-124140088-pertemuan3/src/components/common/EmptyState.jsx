import PropTypes from 'prop-types'

// Gambaran pengguna saat tidak ada data. Disertai petunjuk langkah
// berikutnya agar pengguna tahu apa yang harus dilakukan.
export function EmptyState({ message, action, actionLabel }) {
  return (
    <div className="empty-state" role="status">
      <svg
        className="empty-icon"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" />
        <line
          x1="24"
          y1="24"
          x2="24"
          y2="30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="34"
          x2="28"
          y2="34"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="empty-title">{message}</h3>
      {action && (
        <button type="button" className="empty-action" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
}

export default EmptyState
