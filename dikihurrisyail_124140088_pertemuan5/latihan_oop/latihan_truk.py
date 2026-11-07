# ==============================================================================
# Berkas: latihan_truk.py
# Deskripsi: Subclass Truk(Kendaraan) — kapasitas muatan dan override deskripsi
# ==============================================================================

from importlib.util import spec_from_file_location, module_from_spec
from pathlib import Path

_spec = spec_from_file_location(
    "inheritance", Path(__file__).with_name("03_inheritance.py")
)
_mod = module_from_spec(_spec)
_spec.loader.exec_module(_mod)
Kendaraan = _mod.Kendaraan


class Truk(Kendaraan):
    def __init__(self, merek: str, model: str, tahun: int, kapasitas_maksimal_ton: float):
        super().__init__(merek, model, tahun)
        self.kapasitas_maksimal_ton = kapasitas_maksimal_ton
        self.muatan_saat_ini = 0.0

    def muat_barang(self, berat_ton: float):
        if berat_ton <= 0:
            print("Berat muatan harus lebih dari 0 ton!")
            return
        if self.muatan_saat_ini + berat_ton > self.kapasitas_maksimal_ton:
            sisa = self.kapasitas_maksimal_ton - self.muatan_saat_ini
            print(
                f"[{self.merek}] Muatan {berat_ton} ton ditolak. "
                f"Sisa kapasitas: {sisa} ton."
            )
            return
        self.muatan_saat_ini += berat_ton
        print(f"[{self.merek}] Dimuat +{berat_ton} ton. Muatan sekarang: {self.muatan_saat_ini} ton")

    def deskripsi(self) -> str:
        return (
            f"{super().deskripsi()} "
            f"[Truk muatan {self.muatan_saat_ini}/{self.kapasitas_maksimal_ton} ton]"
        )


if __name__ == "__main__":
    truk = Truk("Hino", "Ranger", 2021, kapasitas_maksimal_ton=8.0)
    print(truk.deskripsi())
    truk.muat_barang(5)
    truk.muat_barang(4)
    truk.muat_barang(3)
    print(truk.deskripsi())
