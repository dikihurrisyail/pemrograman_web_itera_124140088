# ==============================================================================
# Berkas: latihan_karyawan.py
# Deskripsi: Enkapsulasi gaji pokok — @property, setter UMR, gaji bersih
# ==============================================================================

UMR = 3_200_000


class Karyawan:
    def __init__(self, nama: str, jabatan: str, gaji_pokok: float):
        self.nama = nama
        self.jabatan = jabatan
        self.__gaji_pokok = 0.0
        self.gaji_pokok = gaji_pokok

    @property
    def gaji_pokok(self) -> float:
        return self.__gaji_pokok

    @gaji_pokok.setter
    def gaji_pokok(self, nilai: float):
        if nilai < UMR:
            raise ValueError(f"Gaji pokok minimal UMR Rp{UMR:,.0f}, diterima Rp{nilai:,.0f}")
        self.__gaji_pokok = float(nilai)

    def hitung_gaji_bersih(self, pajak_persen: float) -> float:
        return self.__gaji_pokok * (1 - pajak_persen / 100)


if __name__ == "__main__":
    karyawan = Karyawan("Dewi Lestari", "Staff IT", 5_000_000)
    print(f"{karyawan.nama} | {karyawan.jabatan}")
    print(f"Gaji pokok  : Rp{karyawan.gaji_pokok:,.0f}")
    print(f"Gaji bersih : Rp{karyawan.hitung_gaji_bersih(5):,.0f}")

    try:
        karyawan.gaji_pokok = 2_000_000
    except ValueError as e:
        print(f"Ditolak     : {e}")
