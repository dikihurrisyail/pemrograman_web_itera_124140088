class Member:
    """Anggota perpustakaan. Data penting disimpan private."""

    def __init__(self, member_id: str, nama: str):
        self.__id = str(member_id)
        self.__nama = nama.strip()
        if not self.__nama:
            raise ValueError("Nama anggota tidak boleh kosong.")
        self.__aktif = True

    @property
    def id(self) -> str:
        return self.__id

    @property
    def nama(self) -> str:
        return self.__nama

    @nama.setter
    def nama(self, nilai: str):
        nilai = str(nilai).strip()
        if not nilai:
            raise ValueError("Nama anggota tidak boleh kosong.")
        self.__nama = nilai

    @property
    def aktif(self) -> bool:
        return self.__aktif

    def nonaktifkan(self):
        self.__aktif = False

    def aktifkan(self):
        self.__aktif = True

    def info(self) -> str:
        status = "Aktif" if self.__aktif else "Nonaktif"
        return f"{self.__id} | {self.__nama} | {status}"
