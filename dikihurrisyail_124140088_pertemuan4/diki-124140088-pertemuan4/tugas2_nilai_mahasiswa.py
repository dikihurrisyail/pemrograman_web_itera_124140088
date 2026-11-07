mahasiswa = [
    {"nama": "Budi Santoso", "nim": "124140001", "nilai_uts": 80, "nilai_uas": 85, "nilai_tugas": 90},
    {"nama": "Siti Aminah", "nim": "124140002", "nilai_uts": 75, "nilai_uas": 78, "nilai_tugas": 72},
    {"nama": "Andi Wijaya", "nim": "124140003", "nilai_uts": 65, "nilai_uas": 68, "nilai_tugas": 64},
    {"nama": "Rina Putri", "nim": "124140004", "nilai_uts": 50, "nilai_uas": 55, "nilai_tugas": 52},
    {"nama": "Joko Susilo", "nim": "124140005", "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 42},
]


def hitung_nilai_akhir(uts, uas, tugas):
    return (0.30 * uts) + (0.40 * uas) + (0.30 * tugas)


def tentukan_grade(nilai):
    if nilai >= 80:
        return "A"
    elif nilai >= 70:
        return "B"
    elif nilai >= 60:
        return "C"
    elif nilai >= 50:
        return "D"
    else:
        return "E"


print("=== Data Nilai Mahasiswa ===")
print(f"{'Nama':<16} {'NIM':<12} {'Nilai Akhir':>12} {'Grade':>6}")
print("-" * 50)

tertinggi = mahasiswa[0]
terendah = mahasiswa[0]
nilai_tertinggi = hitung_nilai_akhir(
    tertinggi["nilai_uts"], tertinggi["nilai_uas"], tertinggi["nilai_tugas"]
)
nilai_terendah = nilai_tertinggi

for data in mahasiswa:
    nilai_akhir = hitung_nilai_akhir(
        data["nilai_uts"], data["nilai_uas"], data["nilai_tugas"]
    )
    grade = tentukan_grade(nilai_akhir)
    print(f"{data['nama']:<16} {data['nim']:<12} {nilai_akhir:>12.2f} {grade:>6}")

    if nilai_akhir > nilai_tertinggi:
        nilai_tertinggi = nilai_akhir
        tertinggi = data
    if nilai_akhir < nilai_terendah:
        nilai_terendah = nilai_akhir
        terendah = data

print("-" * 50)
print(f"Nilai tertinggi: {tertinggi['nama']} ({tertinggi['nim']}) = {nilai_tertinggi:.2f}")
print(f"Nilai terendah : {terendah['nama']} ({terendah['nim']}) = {nilai_terendah:.2f}")
