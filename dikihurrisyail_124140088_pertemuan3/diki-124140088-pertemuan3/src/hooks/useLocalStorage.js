import { useCallback, useEffect, useRef, useState } from 'react'

// Hook untuk state yang tersinkron dengan localStorage.
//
// Perilaku penting:
// - State diinisialisasi dari nilai tersimpan (lazy initializer) sehingga
//   tidak ada efek samping pada render pertama.
// - Data tersimpan yang rusak (JSON tidak valid) ditangani dengan kembali
//   ke nilai awal, bukan melempar error.
// - Setter menerima nilai langsung atau fungsi (functional update) dan
//   menulis hasil akhirnya ke localStorage, jadi data persisten tanpa
//   useEffect terpisah.
export function useLocalStorage(key, initialValue) {
  // Lazy initializer: baca storage sekali saat init.
  const [storedValue, setStoredValue] = useState(() => {
    // Guard SSR: penyimpanan hanya ada di browser.
    if (typeof window === 'undefined' || !window.localStorage) {
      return initialValue
    }
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) {
        return initialValue
      }
      return JSON.parse(raw)
    } catch {
      // Data tersimpan rusak atau storage tidak tersedia:
      // gunakan nilai awal agar aplikasi tetap berjalan.
      return initialValue
    }
  })

  // Ref menyalin nilai terkini setelah tiap commit (bukan saat render,
  // sesuai aturan react-hooks) supaya functional update dapat di-resolve
  // di luar siklus render tanpa stale closure.
  const valueRef = useRef(storedValue)
  useEffect(() => {
    valueRef.current = storedValue
  }, [storedValue])

  // Wrapper setter: resolusi nilai akhir (mendukung functional update)
  // lalu tulis ke localStorage. Kegagalan penulisan dilaporkan lewat
  // return value, sehingga UI tidak mengklaim data tersimpan.
  const setValue = useCallback(
    (updater) => {
      const next =
        typeof updater === 'function' ? updater(valueRef.current) : updater
      setStoredValue(next)
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
        return true
      } catch {
        return false
      }
    },
    [key],
  )

  return [storedValue, setValue]
}
