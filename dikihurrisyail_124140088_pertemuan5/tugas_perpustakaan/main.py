from library import Library
from library_item import Book, Magazine
from member import Member


def main():
    perpus = Library("Perpustakaan PAW")

    perpus.tambah_item(Book("B001", "Clean Code", 2008, "Robert C. Martin", "978-0132350884"))
    perpus.tambah_item(Book("B002", "Python Crash Course", 2023, "Eric Matthes", "978-1718502703"))
    perpus.tambah_item(Magazine("M001", "National Geographic", 2024, "Januari"))
    perpus.tambah_item(Magazine("M002", "Python Weekly", 2025, "12"))

    ani = Member("A001", "Ani")
    budi = Member("A002", "Budi")
    perpus.daftar_anggota(ani)
    perpus.daftar_anggota(budi)

    print("--- Katalog awal ---")
    perpus.tampilkan_katalog()

    print("\n--- Cari judul mengandung 'python' ---")
    for item in perpus.cari_berdasarkan_judul("python"):
        print(item.get_detail())

    print("\n--- Cari ID B001 dan ID palsu ---")
    ketemu = perpus.cari_berdasarkan_id("B001")
    print(ketemu.get_detail() if ketemu else "tidak ada")
    print(perpus.cari_berdasarkan_id("Z999"))

    print("\n--- Pinjam dan kembalikan ---")
    perpus.pinjam("B001", "A001")
    perpus.pinjam("B001", "A002")
    print("Status B001:", ketemu.status)
    perpus.kembalikan("B001", hari_terlambat=3)
    print("Status B001:", ketemu.status)
    perpus.kembalikan("M001", hari_terlambat=0)

    print("\n--- Polymorphism: satu daftar, method beda ---")
    koleksi = [
        Book("B003", "Fluent Python", 2022, "Luciano Ramalho", "978-1492056355"),
        Magazine("M003", "Kompas", 2026, "Minggu"),
    ]
    for item in koleksi:
        print(item.get_detail())
        print(f"  denda 2 hari: Rp{item.hitung_denda(2):,}")


if __name__ == "__main__":
    main()
