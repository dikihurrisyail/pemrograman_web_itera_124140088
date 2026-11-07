# ==============================================================================
# Berkas: latihan_notifikasi.py
# Deskripsi: Dispatcher multi-saluran — duck typing kirim() + broadcast
# ==============================================================================

class NotifikasiEmail:
    def kirim(self, pesan: str, penerima: str):
        print(f"[EMAIL] ke {penerima}: {pesan}")


class NotifikasiSMS:
    def kirim(self, pesan: str, penerima: str):
        print(f"[SMS] ke {penerima}: {pesan}")


class NotifikasiWhatsApp:
    def kirim(self, pesan: str, penerima: str):
        print(f"[WA] ke {penerima}: {pesan}")


def broadcast_pengumuman(daftar_channel: list, pesan: str):
    print(f"=== SIARAN DARURAT: {pesan} ===")
    for channel, penerima in daftar_channel:
        channel.kirim(pesan, penerima)


if __name__ == "__main__":
    channels = [
        (NotifikasiEmail(), "rektor@itera.ac.id"),
        (NotifikasiSMS(), "081234567890"),
        (NotifikasiWhatsApp(), "081298765432"),
    ]
    broadcast_pengumuman(channels, "Evakuasi kampus, gempa terdeteksi.")
