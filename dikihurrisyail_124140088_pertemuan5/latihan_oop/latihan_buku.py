# ==============================================================================
# Berkas: latihan_buku.py
# Deskripsi: Class Buku — diskon, kartu (__str__), dan len() via __len__
# ==============================================================================

class Buku:
    def __init__(self, judul: str, penulis: str, harga_asli: float, jumlah_halaman: int):
        self.judul = judul
        self.penulis = penulis
        self.harga_asli = harga_asli
        self.jumlah_halaman = jumlah_halaman

    def hitung_harga_diskon(self, persen: float) -> float:
        return self.harga_asli * (1 - persen / 100)

    def __str__(self) -> str:
        return (
            f"Judul   : {self.judul}\n"
            f"Penulis : {self.penulis}\n"
            f"Harga   : Rp{self.harga_asli:,.0f}\n"
            f"Halaman : {self.jumlah_halaman}"
        )

    def __len__(self) -> int:
        return self.jumlah_halaman


if __name__ == "__main__":
    buku = Buku("Clean Code", "Robert C. Martin", 150_000, 464)
    print(buku)
    print(f"Harga diskon 20% : Rp{buku.hitung_harga_diskon(20):,.0f}")
    print(f"len(buku)        : {len(buku)}")
