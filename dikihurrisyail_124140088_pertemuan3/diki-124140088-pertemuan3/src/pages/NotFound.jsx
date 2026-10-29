import { Link } from 'react-router-dom'

// Halaman untuk rute yang tidak terdaftar: pesan ringkas dan tautan
// kembali ke beranda.
export function NotFound() {
  return (
    <div className="page not-found-page">
      <h1 className="page-title not-found-title">Halaman tidak ditemukan</h1>
      <p className="not-found-text">
        Alamat yang Anda tuju tidak tersedia. Mungkin halaman dipindahkan
        atau tidak pernah ada.
      </p>
      <Link to="/" className="btn btn--primary">
        Kembali ke Koleksi Buku
      </Link>
    </div>
  )
}

NotFound.propTypes = {}

export default NotFound
