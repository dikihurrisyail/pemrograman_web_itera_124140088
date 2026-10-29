import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom mensimulasikan DOM agar komponen React bisa di-render di test.
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
})
