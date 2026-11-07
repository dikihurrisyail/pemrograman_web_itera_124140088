from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Item perpustakaan. Tidak bisa dibuat langsung — wajib lewat subclass."""

    def __init__(self, item_id: str, judul: str, tahun: int):
        self._id = str(item_id)
        self._judul = judul
        self._tahun = int(tahun)
        self.__dipinjam = False

    @property
    def id(self) -> str:
        return self._id

    @property
    def judul(self) -> str:
        return self._judul

    @property
    def dipinjam(self) -> bool:
        return self.__dipinjam

    @dipinjam.setter
    def dipinjam(self, nilai: bool):
        if not isinstance(nilai, bool):
            raise TypeError("Status peminjaman harus True atau False.")
        self.__dipinjam = nilai

    @property
    def status(self) -> str:
        return "Dipinjam" if self.__dipinjam else "Tersedia"

    @abstractmethod
    def get_detail(self) -> str:
        """Ringkasan item. Wajib diisi subclass."""

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> int:
        """Denda (rupiah) berdasarkan hari terlambat. Wajib diisi subclass."""


class Book(LibraryItem):
    DENDA_PER_HARI = 2000

    def __init__(self, item_id: str, judul: str, tahun: int, penulis: str, isbn: str):
        super().__init__(item_id, judul, tahun)
        self._penulis = penulis
        self._isbn = isbn

    def get_detail(self) -> str:
        return (
            f"[Buku] {self._id} | {self._judul} ({self._tahun}) | "
            f"{self._penulis} | ISBN {self._isbn} | {self.status}"
        )

    def hitung_denda(self, hari_terlambat: int) -> int:
        if hari_terlambat <= 0:
            return 0
        return hari_terlambat * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    DENDA_PER_HARI = 1000

    def __init__(self, item_id: str, judul: str, tahun: int, edisi: str):
        super().__init__(item_id, judul, tahun)
        self._edisi = edisi

    def get_detail(self) -> str:
        return (
            f"[Majalah] {self._id} | {self._judul} ({self._tahun}) | "
            f"Edisi {self._edisi} | {self.status}"
        )

    def hitung_denda(self, hari_terlambat: int) -> int:
        if hari_terlambat <= 0:
            return 0
        return hari_terlambat * self.DENDA_PER_HARI
