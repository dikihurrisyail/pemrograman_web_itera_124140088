import { Link } from 'react-router-dom'
import { useBooks } from '../hooks/useBooks'
import { BOOK_STATUSES, STATUS_LABELS } from '../utils/bookHelpers'

// Halaman statistik: semua angka berasal dari hook useBookStats
// sehingga selalu sama dengan koleksi aktual. Kondisi koleksi kosong
// menampilkan zero-data state, bukan grafik yang menyesatkan.
export function Stats() {
  const { books, stats } = useBooks()

  return (
    <div className="page stats-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Statistik Koleksi</h1>
          <p className="page-subtitle">
            Ringkasan distribusi {books.length > 0 ? 'koleksi Anda' : 'koleksi'}.
          </p>
        </div>
      </header>

      {stats.total === 0 ? (
        <div className="stats-empty" role="status">
          <h2 className="stats-empty-title">Belum ada buku</h2>
          <p>
            Statistik akan muncul di sini setelah Anda menambah buku pertama
            di halaman <Link to="/">Koleksi Buku</Link>.
          </p>
        </div>
      ) : (
        <section aria-label="Ringkasan koleksi">
          <div className="stats-summary">
            <p className="stats-total-label">Total buku</p>
            <p className="stats-total-number">{stats.total}</p>
          </div>

          {/* Bar distribusi berbasis CSS: lebar proporsional dari jumlah
              buku per status — informasi nyata, bukan grafik palsu. */}
          <div
            className="stats-distribution"
            role="img"
            aria-label={`Distribusi koleksi: ${BOOK_STATUSES.map(
              (s) => `${STATUS_LABELS[s]} ${stats[s]} buku`,
            ).join(', ')}`}
          >
            {BOOK_STATUSES.map((status) => {
              const count = stats[status]
              const percent =
                status === 'owned'
                  ? stats.percentOwned
                  : status === 'reading'
                    ? stats.percentReading
                    : stats.percentWishlist
              return (
                <div key={status} className="stats-row">
                  <div className="stats-row-head">
                    <span className="stats-row-label">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="stats-row-meta">
                      {count} buku · {percent}%
                    </span>
                  </div>
                  <div className="stats-bar-track">
                    <div
                      className={`stats-bar-fill stats-bar-fill--${status}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

Stats.propTypes = {}

export default Stats
