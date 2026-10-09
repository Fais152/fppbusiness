# Product Requirements Document — HPPmate
### (Rebrand & Feature Update dari FppBusiness)

**Versi:** 1.0
**Disusun untuk:** Eksekusi oleh AI coding agent (Antigravity)
**Status:** Draft — menunggu validasi tim sebelum eksekusi

---

## 0. Cara Membaca Dokumen Ini

Dokumen ini ditulis untuk dieksekusi AI coding agent, bukan cuma dibaca manusia. Setiap fase punya status eksplisit:
- 🟢 **BUILD** — kerjakan sekarang, scope MVP
- 🟡 **ROADMAP** — sebut sebagai rencana, jangan dikerjakan/diklaim selesai dulu
- 🔴 **BELUM DIPUTUSKAN** — jangan dieksekusi sebelum tim mengisi nilainya

**Instruksi untuk Antigravity: jangan mengerjakan fase 🟡 atau item 🔴 tanpa konfirmasi eksplisit dari pemilik proyek.**

---

## 1. Ringkasan Produk

HPPmate (sebelumnya FppBusiness) adalah platform web untuk membantu UMKM — khususnya sektor F&B skala mikro-kecil — menghitung HPP, margin, modal awal, dan titik balik modal, sekaligus belajar konsep tersebut sambil memakai tool-nya.

**Perubahan di update ini:**
1. Rebrand penuh: nama, logo, maskot, palet warna
2. Redesign visual ke arah playful/toy-like yang distinctive (bukan tampilan generik AI)
3. Penambahan 6 fitur baru di luar 4 fitur inti yang sudah ada
4. Sistem Free Tier dan Premium dengan batasan spesifik per fitur

---

## 2. Brand Identity

### 2.1 Nama
- **Nama lama:** FppBusiness / Fpp
- **Nama baru:** **HPPmate**
- Semua referensi teks "Fpp" di dalam aplikasi (navbar, judul halaman, metadata, dsb.) harus diganti ke "HPPmate"

### 2.2 Logo
- Aset logo: `hppmate-logo.png` (lampiran — bentuk huruf "H" yang menyerupai gembok terbuka dengan senyum, aksen sinar kuning di kanan atas)
- Logo dipakai di: navbar/header (ukuran kecil, dengan wordmark "HPPmate"), favicon (ikon gembok saja, tanpa wordmark), splash/loading state

### 2.3 Maskot
- Aset maskot: `hppmate-maskot.png` (lampiran — karakter 3D bertubuh huruf "H", ekspresi ramah mengedip, memberi jempol, dengan sepatu sneaker biru-kuning)
- Maskot dipakai di: halaman onboarding/banner edukasi, state kosong (empty state) seperti "Belum ada produk", notifikasi pencapaian (misal setelah berhasil hitung BEP pertama kali), halaman error 404

**Instruksi Antigravity:** gunakan file logo dan maskot yang disediakan di aset proyek. Jangan generate ulang logo/maskot dengan AI image tool — dua aset ini sudah final dan disetujui.

### 2.4 Palet Warna
Diturunkan dari logo/maskot (biru navy + kuning/oranye keemasan), BUKAN palet generik AI:

| Token | Hex (perkiraan dari aset) | Pemakaian |
|---|---|---|
| `--color-primary` | `#1E3A8A` (navy biru tua) | Elemen utama, tombol primer, teks heading |
| `--color-accent` | `#F5A623` (kuning keemasan) | Aksen, highlight, call-to-action sekunder |
| `--color-bg-dark` | `#0D1117` | Background mode gelap (existing) |
| `--color-bg-light` | `#FDFBF6` (off-white hangat, BUKAN putih bersih `#FFFFFF`) | Background mode terang |

**Dilarang keras:** gradasi ungu di atas background putih — ini ciri paling dikenali dari "AI slop" design dan harus dihindari total.

### 2.5 Tipografi
**Dilarang:** Inter, Roboto, Arial, atau font sistem default (font-font ini yang paling sering dipakai AI generator sehingga terasa generik).

**Rekomendasi arah:** pasangkan satu display font yang punya karakter (sedikit rounded/playful, selaras dengan bentuk maskot yang "chunky" dan ramah) untuk heading, dengan satu font teks yang tetap sangat terbaca untuk body text dan angka finansial (karena ini aplikasi finansial, keterbacaan angka adalah prioritas, bukan tempat untuk font dekoratif).

**Instruksi Antigravity:** pilih dari Google Fonts pasangan font yang BUKAN Inter/Roboto/Arial/Space Grotesk (Space Grotesk juga sudah terlalu umum dipakai AI tools). Contoh arah yang sesuai playful/toy-like: font display dengan sudut membulat (rounded sans-serif) dipasangkan dengan font teks netral yang tetap hangat. Tentukan pasangan final dan dokumentasikan pilihannya di awal implementasi, konsisten dipakai di semua halaman.

---

## 3. Prinsip Desain — Anti-AI-Slop

Ini bukan saran estetika opsional, ini **instruksi wajib** untuk Antigravity saat membangun UI.

### 3.1 Arah Aesthetic yang Dipilih
**Playful / toy-like**, selaras dengan karakter maskot — tapi dengan pembagian tegas:
- **Area BOLEH penuh playful:** maskot, banner edukasi, state kosong, notifikasi pencapaian, halaman onboarding
- **Area HARUS tetap tenang dan presisi:** tabel angka HPP, hasil kalkulasi, dashboard metrik, laporan PDF — karena ini keputusan finansial nyata, bukan tempat bermain-main visual

### 3.2 Wajib Dihindari (Ciri AI Slop)
- Font generik (Inter, Roboto, Arial, Space Grotesk, font sistem)
- Gradasi ungu di atas background putih
- Layout kartu yang terlalu simetris dan bisa ditebak di semua halaman
- Desain "cookie-cutter" yang terasa bisa dipakai untuk app apa saja, tidak spesifik untuk HPPmate/UMKM Indonesia

### 3.3 Wajib Diterapkan
- **Warna:** satu warna dominan dengan aksen tajam (bukan warna rata merata) — gunakan navy sebagai dominan, kuning sebagai aksen tajam, bukan campur rata keduanya
- **Komposisi:** boleh sedikit "pecah grid" di halaman non-kritis (misal banner edukasi dengan elemen maskot yang sedikit overlap/asimetris), tapi dashboard angka tetap grid rapi dan presisi
- **Motion:** animasi untuk momen penting saja, bukan micro-interaction berlebihan di semua tempat — contoh: animasi halus saat maskot muncul pertama kali di onboarding, bukan animasi di setiap hover tombol
- **Detail visual:** boleh tambahkan tekstur ringan/pola titik-titik halus (dot grid) di background seperti yang sudah ada di versi lama — ini elemen existing yang khas, pertahankan sebagai ciri visual

### 3.4 Konsistensi Mode Gelap/Terang
Aplikasi existing sudah punya mode gelap sebagai default. Pertahankan dua mode (gelap dan terang), pastikan palet warna di atas diterapkan konsisten di keduanya, bukan cuma invert otomatis.

---

## 4. Fitur — Spesifikasi Lengkap

### 4.1 Fitur Inti (sudah ada, status: pertahankan dan sempurnakan visualnya)

| Fitur | Deskripsi | Tier |
|---|---|---|
| Kalkulasi HPP | Input bahan baku, kategori produk, target margin → output HPP per unit | Free Tier & Premium |
| Rincian Modal Awal | Daftar item pengeluaran awal dengan kategori → total modal dibutuhkan | Free Tier & Premium |
| Dashboard Produk | Ringkasan total produk, rata-rata margin, produk terbaik, total modal | Free Tier & Premium |
| Analisis & Break Even Point | Skor kesehatan bisnis, kalkulasi BEP berdasarkan target hari dan biaya operasional | **Premium saja** |

**Catatan teknis:** ada bug diketahui di versi lama — saat margin rata-rata 0% (proyek baru tanpa produk), kalkulasi BEP menghasilkan angka fallback yang tidak masuk akal (porsi = nominal rupiah persis sama). 🟢 **BUILD** — perbaiki ini: saat tidak ada data produk, tampilkan state kosong yang jelas ("Tambahkan produk dulu untuk melihat BEP"), bukan hasil kalkulasi palsu.

### 4.2 Fitur Baru 🟢 BUILD

#### a. Ekspor Laporan PDF — **Premium saja**
- Satu dokumen PDF gabungan per proyek, berisi: ringkasan produk & HPP, rincian modal awal, hasil BEP dengan asumsinya, skor kesehatan bisnis, nama proyek dan tanggal cetak
- Istilah di UI: **"Laporan Analisis Produk"** atau **"Ringkasan Kalkulasi Bisnis"** — JANGAN pakai istilah "Laporan Keuangan" (financial statement), karena itu istilah akuntansi formal untuk neraca/laba-rugi/arus kas yang berbeda dari yang dihasilkan fitur ini
- Format: PDF saja untuk versi ini. Excel BUKAN scope fase ini (lihat 🟡 Roadmap)

#### b. Transaksi Harian — **Free Tier (terbatas) & Premium (penuh)**
- Input manual kas masuk dan kas keluar harian per proyek
- Free Tier: riwayat yang bisa dilihat dibatasi 30 hari terakhir
- Premium: riwayat tanpa batas, bisa lihat data lama kapan saja

#### c. Peringatan Stok Menipis — **Free Tier (terbatas) & Premium (penuh)**
- Tambahkan field "stok tersedia" pada komposisi bahan baku yang sudah ada di form produk
- Sistem menampilkan notifikasi/badge saat stok di bawah ambang batas yang ditentukan user
- Free Tier: maksimal 5 item bahan baku yang bisa dipantau
- Premium: tanpa batas jumlah item

#### d. Rekap Mingguan/Bulanan Otomatis — **Free Tier (terbatas) & Premium (penuh)**
- Agregasi otomatis dari data Transaksi Harian, ditampilkan sebagai grafik tren
- Free Tier: rekap mingguan saja
- Premium: rekap mingguan DAN bulanan, ditambah **perbandingan target BEP vs realisasi penjualan aktual** — ini fitur pembeda utama, hubungkan data BEP (proyeksi) dengan data Transaksi Harian (aktual) untuk menjawab "apakah bisnis saya benar-benar balik modal sesuai rencana?"

#### e. Banner Edukasi HPP — **Semua tier, tanpa batasan**
- Muncul setelah user baru login pertama kali, berupa banner/kartu dengan maskot, ajakan "Belum paham HPP? Yuk belajar dulu"
- **Bersifat opsional** — ada tombol "Lewati" yang jelas, BUKAN alur wajib bercabang dengan kuis
- Tetap bisa diakses kapan saja lewat menu permanen "Belajar HPP" di dashboard

#### f. Modul Edukasi Infografis — **Semua tier, tanpa batasan**
- Konten edukasi dalam bentuk infografis/teks interaktif, menjelaskan konsep HPP, margin, dan markup dengan bahasa sederhana untuk UMKM awam
- Ditempatkan di menu "Belajar HPP" dan dapat dipicu dari Banner Edukasi (4.2.e)
- **Catatan penting soal rumus:** pastikan konten edukasi menjelaskan perbedaan margin (persentase dari harga jual) dan markup (persentase dari HPP) secara eksplisit — ini sumber kebingungan umum di kalangan UMKM dan relevan langsung dengan kolom "Target Margin (%)" yang sudah ada di form produk

### 4.3 Fitur Roadmap 🟡 (sebutkan statusnya jelas, JANGAN kerjakan di fase ini)

| Item | Status | Alasan ditunda |
|---|---|---|
| Modul Edukasi Video Animasi | 🟡 Roadmap, belum dikerjakan | Produksi konten terpisah, butuh waktu di luar scope development |
| Ekspor ke Excel | 🟡 Roadmap, belum dikerjakan | Kompleksitas teknis (format rumus, struktur sel) tidak sepadan dengan waktu tersisa; PDF sudah cukup untuk tujuan dokumentasi/presentasi ke investor |
| Riwayat Perubahan Harga Bahan Baku | 🟡 Roadmap, nice-to-have | Bukan prioritas, bisa menyusul setelah fitur inti stabil |

**Instruksi Antigravity: untuk ketiga item di atas, JANGAN membangun fiturnya. Jika relevan, cukup sediakan placeholder UI bertuliskan "Segera Hadir" tanpa fungsi aktif.**

---

## 5. Pembatasan Free Tier vs Premium — Ringkasan Lengkap

| Fitur | Free Tier | Premium |
|---|---|---|
| Jumlah Produk | Maksimal 10 | Tanpa batas |
| Analisis & BEP | Terkunci | Terbuka |
| Ekspor Laporan PDF | Tidak tersedia | Tersedia |
| Transaksi Harian | Riwayat 30 hari | Tanpa batas |
| Peringatan Stok | Maksimal 5 item | Tanpa batas |
| Rekap Otomatis | Mingguan saja | Mingguan + bulanan + perbandingan BEP vs realisasi |
| Edukasi HPP (banner, infografis) | Tersedia penuh | Tersedia penuh |

**Harga Premium:** 🔴 **BELUM DIPUTUSKAN.** Jangan hardcode nominal apa pun di UI (jangan tulis "Rp XX.XXX/bulan"). Gunakan placeholder seperti "Hubungi kami" atau sembunyikan dulu elemen harga sampai tim menentukan nominal.

---

## 6. Alur Kerja Pengguna (User Flow)

```
1. Login
2. [Akun baru] → Banner edukasi HPP (opsional, bisa dilewati)
3. Buat/buka proyek
4. Isi Produk & HPP
5. Isi Modal Awal
6. Catat Transaksi Harian
7. Pantau Stok Bahan
8. --- Percabangan Tier ---
   Free Tier → Dashboard dasar (limit sesuai tabel di atas) → Prompt upgrade
   Premium → Analisis → Break Even → Rekap Lengkap (BEP vs realisasi) → Ekspor PDF
9. Simpan proyek → Kembali ke Portofolio
10. Menu "Belajar HPP" dapat diakses kapan saja dari mana saja, lintas tier
```

---

## 7. Fase Eksekusi yang Disarankan

Untuk menghindari AI coding agent kewalahan mengerjakan semua sekaligus, disarankan urutan berikut:

**Fase 1 — Rebrand (🟢 BUILD duluan, scope kecil, dampak besar)**
- Ganti nama, logo, favicon, palet warna, font di seluruh aplikasi
- Perbaiki bug fallback BEP di margin 0%

**Fase 2 — Redesign Visual (🟢 BUILD)**
- Terapkan prinsip desain anti-AI-slop di seluruh halaman existing (4 fitur inti)
- Pastikan konsistensi dark/light mode

**Fase 3 — Fitur Baru Gratis-Terbatas (🟢 BUILD)**
- Transaksi Harian, Peringatan Stok, Rekap Mingguan — bangun dulu versi Free Tier-nya

**Fase 4 — Fitur Premium (🟢 BUILD)**
- Buka batasan Premium untuk semua fitur di atas, bangun Ekspor PDF, bangun Rekap Lengkap dengan perbandingan BEP vs realisasi

**Fase 5 — Edukasi (🟢 BUILD)**
- Banner opsional + modul infografis

**Fase 6 — Roadmap (🟡 JANGAN BUILD, cukup dokumentasikan)**
- Video, Excel, riwayat harga

---

## 8. Hal yang Masih Harus Diputuskan Tim (🔴)

Sebelum PRD ini final dan diserahkan ke Antigravity untuk eksekusi penuh:

1. **Nominal harga Premium** — belum ada angka
2. **Domain/URL final** — apakah tetap di fppbusiness.vercel.app atau pindah ke domain dengan nama HPPmate
3. **Font pairing final** — Antigravity diberi arahan (bukan Inter/Roboto/dst.), tapi pasangan font spesifik perlu direview tim sebelum dikunci permanen
4. **Siapa yang menulis/mereview konten infografis edukasi** — perlu rujukan materi akuntansi biaya dasar yang jelas, bukan dikarang sendiri tanpa dasar

---

## Lampiran: Aset

- `hppmate-logo.png` — logo utama
- `hppmate-maskot.png` — maskot karakter 3D
