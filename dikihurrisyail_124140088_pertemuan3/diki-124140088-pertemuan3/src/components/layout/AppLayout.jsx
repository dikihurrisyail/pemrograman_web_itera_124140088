import PropTypes from 'prop-types'
import { Navigation } from './Navigation'

// Rangka halaman: navigasi di atas, konten dengan lebar maksimum
// di tengah, footer ringkas. Tidak memakai sidebar karena aplikasi
// ini hanya memiliki dua halaman konten.
export function AppLayout({ children }) {
  return (
    <div className="layout">
      <Navigation />
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">
        <p>Praktikum Pengembangan Aplikasi WEB Pertemuan 3</p>
      </footer>
    </div>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout
