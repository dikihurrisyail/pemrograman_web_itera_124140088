import { NavLink } from 'react-router-dom'

// Navigasi ringkas di bagian atas aplikasi. NavLink memberi styling
// berbeda untuk rute aktif tanpa logika pathname manual.
export function Navigation() {
  const linkClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' nav-link--active' : '')

  return (
    <nav className="nav" aria-label="Navigasi utama">
      <span className="nav-brand">Koleksi Buku</span>
      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Buku
        </NavLink>
        <NavLink to="/stats" className={linkClass}>
          Statistik
        </NavLink>
      </div>
    </nav>
  )
}

Navigation.propTypes = {}

export default Navigation
