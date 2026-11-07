from library_item import LibraryItem
from member import Member


class Library:
    """Koleksi item. Disimpan di atribut private __koleksi."""

    def __init__(self, nama: str):
        self.nama = nama
        self.__koleksi: dict[str, LibraryItem] = {}
        self.__anggota: dict[str, Member] = {}

    def tambah_item(self, item: LibraryItem):
        if not isinstance(item, LibraryItem):
            raise TypeError("Item harus turunan LibraryItem.")
        if item.id in self.__koleksi:
            raise ValueError(f"ID '{item.id}' sudah ada di katalog.")
        self.__koleksi[item.id] = item

    def daftar_anggota(self, member: Member):
        if member.id in self.__anggota:
            raise ValueError(f"Anggota '{member.id}' sudah terdaftar.")
        self.__anggota[member.id] = member

    def tampilkan_katalog(self):
        print(f"=== Katalog {self.nama} ({len(self.__koleksi)} item) ===")
        if not self.__koleksi:
            print("(kosong)")
            return
        for item in self.__koleksi.values():
            print(item.get_detail())

    def cari_berdasarkan_judul(self, kata: str) -> list[LibraryItem]:
        kata = kata.lower()
        return [item for item in self.__koleksi.values() if kata in item.judul.lower()]

    def cari_berdasarkan_id(self, item_id: str) -> LibraryItem | None:
        return self.__koleksi.get(str(item_id))

    def pinjam(self, item_id: str, member_id: str) -> bool:
        item = self.cari_berdasarkan_id(item_id)
        member = self.__anggota.get(str(member_id))
        if item is None:
            print(f"Gagal pinjam: item '{item_id}' tidak ditemukan.")
            return False
        if member is None or not member.aktif:
            print(f"Gagal pinjam: anggota '{member_id}' tidak aktif / tidak terdaftar.")
            return False
        if item.dipinjam:
            print(f"Gagal pinjam: '{item.judul}' sedang dipinjam.")
            return False
        item.dipinjam = True
        print(f"{member.nama} meminjam '{item.judul}'.")
        return True

    def kembalikan(self, item_id: str, hari_terlambat: int = 0) -> int:
        item = self.cari_berdasarkan_id(item_id)
        if item is None or not item.dipinjam:
            print(f"Gagal kembali: item '{item_id}' tidak sedang dipinjam.")
            return 0
        item.dipinjam = False
        denda = item.hitung_denda(hari_terlambat)
        print(f"'{item.judul}' dikembalikan. Denda: Rp{denda:,}")
        return denda
