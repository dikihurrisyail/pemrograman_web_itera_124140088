// Setup file untuk seluruh unit test:
// - @testing-library/jest-dom menambahkan matcher DOM (toBeVisible, dll).
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// Reset localStorage antar test agar tiap skenario mulai dari kondisi
// bersih (setiap test mengasumsikan koleksi kosong kecuali di-seed).
afterEach(() => {
  window.localStorage.clear()
})
