# ==============================================================================
# Berkas: latihan_storage.py
# Deskripsi: Interface FileStorage(ABC) — LocalDiskStorage & CloudStorage
# ==============================================================================

from abc import ABC, abstractmethod


class FileStorage(ABC):
    @abstractmethod
    def upload_file(self, nama_file: str, data_bytes: bytes) -> bool:
        pass

    @abstractmethod
    def download_file(self, nama_file: str) -> bytes:
        pass


class LocalDiskStorage(FileStorage):
    def __init__(self, folder: str = "./uploads"):
        self.folder = folder
        self._berkas = {}

    def upload_file(self, nama_file: str, data_bytes: bytes) -> bool:
        self._berkas[nama_file] = data_bytes
        print(f"[DISK {self.folder}] Simpan {nama_file} ({len(data_bytes)} byte)")
        return True

    def download_file(self, nama_file: str) -> bytes:
        data = self._berkas[nama_file]
        print(f"[DISK {self.folder}] Ambil {nama_file} ({len(data)} byte)")
        return data


class CloudStorage(FileStorage):
    def __init__(self, host: str = "storage.itera.ac.id"):
        self.host = host
        self._berkas = {}

    def upload_file(self, nama_file: str, data_bytes: bytes) -> bool:
        self._berkas[nama_file] = data_bytes
        print(f"[CLOUD {self.host}] Upload {nama_file} ({len(data_bytes)} byte)")
        return True

    def download_file(self, nama_file: str) -> bytes:
        data = self._berkas[nama_file]
        print(f"[CLOUD {self.host}] Download {nama_file} ({len(data)} byte)")
        return data


if __name__ == "__main__":
    storages = [
        LocalDiskStorage("./data"),
        CloudStorage("s3.itera.ac.id"),
    ]
    payload = b"laporan-praktikum-oop"

    for storage in storages:
        storage.upload_file("laporan.txt", payload)
        hasil = storage.download_file("laporan.txt")
        assert hasil == payload

    try:
        FileStorage()
    except TypeError as err:
        print(f"ABC ditolak: {err}")
