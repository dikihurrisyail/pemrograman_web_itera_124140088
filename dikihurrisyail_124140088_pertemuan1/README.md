````markdown
# Mini POS - Kasir & Keranjang Belanja Sederhana

## Identitas

- **Nama:** Diki Hurrisyail
- **NIM:** 124140088
- **Kelas Praktikum:** Isi sesuai kelas praktikum

---

## Deskripsi Aplikasi

Mini POS adalah aplikasi web kasir sederhana yang dibuat untuk studi kasus kantin atau toko kampus.

Aplikasi digunakan untuk memasukkan barang, menghitung subtotal dan total belanja, memberikan diskon otomatis, menggunakan kode promo, menghitung kembalian, serta menyimpan data keranjang menggunakan localStorage.

Aplikasi juga menyediakan tombol naik/turun pada input harga untuk memudahkan kasir mengatur harga dengan perubahan sebesar Rp1.000.

---

## Tujuan

1. Menerapkan validasi input form menggunakan JavaScript.
2. Menerapkan perhitungan subtotal, total, diskon, dan kembalian.
3. Menerapkan manajemen keranjang menggunakan localStorage.
4. Memisahkan struktur HTML, styling CSS, dan logika JavaScript.
5. Membuat antarmuka kasir yang sederhana dan mudah digunakan.

---

## Panduan Menjalankan

1. Buka folder proyek di VS Code.
2. Pastikan terdapat file:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. Jalankan `index.html` menggunakan Live Server.
4. Aplikasi akan terbuka di browser.
5. Masukkan nama barang, harga satuan, dan jumlah barang.
6. Pada input harga, tombol **↑** dapat digunakan untuk menaikkan harga sebesar Rp1.000 dan tombol **↓** untuk menurunkan harga sebesar Rp1.000.
7. Klik **Tambah ke Keranjang**.
8. Masukkan kode promo `HEMATBGT` jika ingin menggunakan promo.
9. Masukkan uang bayar untuk melihat kembalian.

---

## Daftar Fitur

- [x] Validasi nama barang minimal 3 karakter.
- [x] Validasi harga minimal Rp500.
- [x] Validasi qty berupa angka bulat minimal 1.
- [x] Pesan error berwarna merah di bawah input yang salah.
- [x] Tambah barang ke keranjang.
- [x] Perhitungan subtotal otomatis.
- [x] Perhitungan total belanja otomatis.
- [x] Tombol naik/turun harga dengan perubahan Rp1.000.
- [x] Diskon otomatis 10% jika total belanja minimal Rp50.000.
- [x] Kode promo `HEMATBGT`.
- [x] Menampilkan nominal diskon.
- [x] Menampilkan total akhir.
- [x] Input uang bayar.
- [x] Perhitungan kembalian otomatis.
- [x] Keterangan jika uang belum mencukupi.
- [x] Hapus item dari keranjang.
- [x] Penyimpanan keranjang menggunakan localStorage.
- [x] Data keranjang tetap tersedia setelah halaman di-refresh.
- [x] Tombol Transaksi Baru untuk mengosongkan keranjang.
- [x] Membersihkan data localStorage saat transaksi baru.
- [x] Format nominal menggunakan Rupiah.
- [x] Tampilan responsive.

---

## Screenshot

Tambahkan minimal 3 screenshot aplikasi:

### 1. Tampilan Form Input

Screenshot menampilkan form input nama barang, harga satuan, qty, dan tombol tambah barang.

Form:
ss/form.png

### 2. Tampilan Validasi Error

Screenshot menampilkan pesan validasi berwarna merah ketika data yang dimasukkan tidak sesuai ketentuan.

Validasi:
ss/validasi.png
ss/validasi2.png

### 3. Tampilan Hasil Transaksi

Screenshot menampilkan tabel keranjang, subtotal, total belanja, diskon, total akhir, uang bayar, dan kembalian.

Hasil:
ss/hasil.png

---

## Penjelasan Teknis Singkat

### 1. Validasi Input

Validasi dilakukan menggunakan fungsi `validateForm()`.

Ketentuan input:

* Nama barang wajib diisi.
* Nama barang minimal 3 karakter.
* Harga satuan minimal Rp500.
* Qty harus berupa angka bulat minimal 1.

Jika input tidak valid, sistem menampilkan pesan error berwarna merah di bawah input yang salah.

Barang tidak akan dimasukkan ke keranjang jika terdapat data yang tidak valid.

---

### 2. Penambahan Barang

Ketika tombol **Tambah ke Keranjang** ditekan, sistem melakukan validasi terlebih dahulu.

Jika semua data valid, barang akan dibuat sebagai sebuah object yang berisi:

```javascript
{
    id,
    name,
    price,
    qty
}
```

Object tersebut kemudian dimasukkan ke dalam array `cart`.

---

### 3. Perhitungan Subtotal

Subtotal setiap barang dihitung menggunakan rumus:

```text
Subtotal = Harga Satuan × Qty
```

Contoh:

```text
Harga = Rp5.000
Qty   = 2

Subtotal = Rp5.000 × 2
         = Rp10.000
```

---

### 4. Perhitungan Total Belanja

Total belanja diperoleh dari penjumlahan seluruh subtotal barang yang terdapat di dalam keranjang.

```text
Total Belanja =
Subtotal Barang 1 +
Subtotal Barang 2 +
Subtotal Barang 3 + ...
```

Perhitungan dilakukan otomatis setiap kali barang ditambahkan atau dihapus.

---

### 5. Pengaturan Harga

Input harga menggunakan atribut `step="1000"`.

Dengan pengaturan tersebut, tombol naik dan turun pada input angka mengubah nilai harga sebesar Rp1.000.

Contoh:

```text
Rp5.000
   ↓
Rp6.000
   ↓
Rp7.000
```

Harga tetap memiliki batas minimum sesuai validasi yang telah ditentukan.

---

### 6. Perhitungan Diskon

Aplikasi menyediakan dua cara untuk mendapatkan diskon 10%.

#### Diskon berdasarkan total belanja

Jika total belanja mencapai minimal Rp50.000, sistem otomatis memberikan diskon 10%.

```text
Total Belanja >= Rp50.000
```

Rumus diskon:

```text
Diskon = Total Belanja × 10%
```

#### Kode Promo

Pengguna juga dapat memasukkan kode:

```text
HEMATBGT
```

Jika kode benar, diskon 10% akan aktif.

Total akhir dihitung menggunakan rumus:

```text
Total Akhir = Total Belanja - Diskon
```

Nominal diskon dan total akhir ditampilkan pada bagian pembayaran.

---

### 7. Perhitungan Pembayaran dan Kembalian

Kasir dapat memasukkan nominal uang yang diterima pada bagian **Uang Bayar**.

Rumus kembalian:

```text
Kembalian = Uang Bayar - Total Akhir
```

Jika uang bayar lebih kecil dari total akhir, sistem akan menampilkan keterangan bahwa uang belum mencukupi beserta nominal kekurangannya.

---

### 8. Menghapus Barang

Setiap barang pada tabel memiliki tombol **Hapus**.

Ketika tombol tersebut ditekan:

1. Barang dihapus dari array `cart`.
2. Data localStorage diperbarui.
3. Tabel keranjang diperbarui.
4. Total belanja dihitung ulang.
5. Diskon dihitung ulang.
6. Total akhir diperbarui.

---

### 9. LocalStorage

Keranjang disimpan menggunakan `localStorage`.

Data array `cart` diubah menjadi JSON menggunakan:

```javascript
localStorage.setItem(
    "miniPOS_cart",
    JSON.stringify(cart)
);
```

Ketika aplikasi dibuka atau di-refresh, data diambil kembali menggunakan:

```javascript
JSON.parse(
    localStorage.getItem("miniPOS_cart")
);
```

Dengan mekanisme tersebut, isi keranjang tidak hilang ketika halaman di-refresh.

---

### 10. Transaksi Baru

Tombol **Transaksi Baru** digunakan untuk menghapus transaksi yang sedang berjalan.

Ketika tombol ditekan dan dikonfirmasi:

* Semua barang dihapus.
* Keranjang dikosongkan.
* `localStorage` dibersihkan.
* Input pembayaran dikosongkan.
* Kode promo dihapus.
* Form input barang di-reset.
* Total kembali menjadi Rp0.

---

## Struktur File

```text
diki_hurrisyail_124140088_pertemuan1/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── modul/
    └── file latihan praktikum
```

### `index.html`

Berisi struktur halaman aplikasi seperti form input barang, tabel keranjang, bagian diskon, pembayaran, dan kembalian.

### `style.css`

Berisi seluruh pengaturan tampilan aplikasi seperti layout, warna, tabel, tombol, form, dan responsive design.

### `script.js`

Berisi logika utama aplikasi seperti:

* Validasi input.
* Penambahan barang.
* Penghapusan barang.
* Perhitungan subtotal.
* Perhitungan total.
* Perhitungan diskon.
* Kode promo.
* Perhitungan kembalian.
* LocalStorage.
* Reset transaksi.

### `README.md`

Berisi dokumentasi aplikasi, cara menjalankan, daftar fitur, screenshot, dan penjelasan teknis.

### `modul/`

Digunakan untuk menyimpan file latihan yang dikerjakan selama mengikuti materi praktikum.

---

## Repository GitHub

Repository dibuat dengan format:

```text
pemrograman_web_itera_124140088
```

Repository harus disetel menjadi **Public** agar dapat dinilai oleh asisten praktikum.

---

## Teknologi yang Digunakan

* HTML5
* CSS3
* JavaScript
* Browser LocalStorage
* JSON
* Live Server

---

## Kesimpulan

Mini POS merupakan aplikasi kasir sederhana yang menerapkan tiga kompetensi utama praktikum, yaitu validasi input form, kalkulator/perhitungan otomatis, dan manajemen keranjang menggunakan localStorage.

Fitur tambahan berupa kode promo `HEMATBGT` dan tombol perubahan harga sebesar Rp1.000 dibuat untuk mempermudah proses transaksi.

```

README ini sudah tetap mengikuti bagian yang diminta dosen/asisten: **Identitas, Deskripsi Aplikasi, Panduan Menjalankan, Daftar Fitur, Screenshot, Penjelasan Teknis, dan Struktur File**, sekaligus memasukkan fitur tambahan harga naik/turun Rp1.000.
```