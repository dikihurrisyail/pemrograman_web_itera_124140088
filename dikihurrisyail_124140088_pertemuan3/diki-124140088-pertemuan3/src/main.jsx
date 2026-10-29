import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import BookProvider from './context/BookContext'

// Struktur render:
// - StrictMode: validasi rendering ganda di development.
// - BrowserRouter: rute bersih (tanpa hash) untuk React Router.
// - BookProvider: satu sumber state buku + persistensi localStorage
//   yang dipakai seluruh halaman di bawahnya.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BookProvider>
        <App />
      </BookProvider>
    </BrowserRouter>
  </StrictMode>,
)
