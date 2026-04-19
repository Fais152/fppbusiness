# Dokumen Master Proyek: Fpp business
**Peran:** Business Analyst & Product Owner
**Format:** Product Requirements Document (PRD), User Flow, & Database Schema

---

## 1. Product Requirements Document (PRD)

### 1.1 Ringkasan Eksekutif
**Fpp business** adalah aplikasi berbasis web yang dirancang untuk membantu pemilik bisnis (terutama UMKM/pemula) dalam merencanakan keuangan produk. Aplikasi ini menghitung Harga Pokok Penjualan (HPP), harga jual berdasarkan margin, serta memberikan analisis kesehatan modal, target Break Even Point (BEP), dan saran bisnis otomatis.

### 1.2 Standar Desain UI/UX (Modern & Interaktif)
* **Tema Visual:** Bersih (Clean), minimalis, dengan skema warna profesional (biru laut/hijau growth).
* **Interaktivitas:** Slider real-time untuk margin, grafik interaktif, dan tooltips edukatif.
* **Mode:** Mendukung Dark & Light Mode serta Progressive Web App (PWA).

### 1.3 Fitur Utama

#### A. Autentikasi & Akun
* **Login with Google:** Akses cepat tanpa password baru.
* **Cloud Sync:** Simpan banyak draf bisnis (Multi-project) yang dapat diakses dari perangkat apa pun.

#### B. Modul HPP (Harga Pokok Penjualan)
* **Komponen:** Bahan Baku, Tenaga Kerja Langsung, dan Overhead (Listrik, sewa, kemasan).
* **Panduan Edukasi:** Penjelasan tiap istilah dan cara input langkah-demi-langkah (Wizard).

#### C. Analisis Harga Jual & Modal
* **Kalkulasi Total:** Menampilkan Total Modal dan Total Nilai Jual (Harga + Margin).
* **Saran Bisnis:** Label status "Normal", "Beresiko", atau "Premium" berdasarkan rata-rata industri.

#### D. Fitur BEP (Break Even Point)
* **Target Kustom:** User bisa memilih target berdasarkan Unit terjual atau Waktu (Hari/Bulan).
* **Simulasi Saran:** Contoh: "Untuk balik modal dalam 3 bulan, Anda perlu menjual 18 unit/hari."

#### E. Ekspor Laporan
* **Format:** Export ke PDF atau Gambar untuk presentasi ke mitra/investor.

---

## 2. User Flow (Alur Pengguna)

1.  **Landing Page:** Penjelasan fitur & nilai produk.
2.  **Login:** Menggunakan Google OAuth.
3.  **Dashboard:** Klik "+ Buat Proyek Baru".
4.  **Profil Bisnis:** Input nama bisnis & kategori industri.
5.  **Wizard HPP:**
    * Input Nama Produk.
    * Input Bahan Baku & Biaya Operasional.
6.  **Simulasi Margin:** Geser slider margin untuk melihat harga jual.
7.  **Target BEP:** Pilih target balik modal (Unit/Waktu).
8.  **Halaman Analisis:** Melihat grafik, ringkasan modal, dan saran otomatis.
9.  **Ekspor:** Download laporan final.

---

## 3. Struktur Basis Data (Database Schema)

### Tabel: `Users`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | ID unik pengguna |
| `google_id` | VARCHAR | ID dari Google OAuth |
| `name` | VARCHAR | Nama lengkap |
| `email` | VARCHAR | Alamat email |

### Tabel: `Business_Projects`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | ID unik proyek |
| `user_id` | INT (FK) | Relasi ke Users |
| `business_name` | VARCHAR | Nama bisnis |
| `industry_category` | VARCHAR | Cth: F&B, Retail |
| `total_capital` | DECIMAL | Modal awal disiapkan |

### Tabel: `Products`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | ID unik produk |
| `project_id` | INT (FK) | Relasi ke Proyek |
| `product_name` | VARCHAR | Nama produk |
| `target_margin_pct`| INT | % Margin target |
| `selling_price` | DECIMAL | Harga jual akhir |

### Tabel: `HPP_Components`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | INT (PK) | ID komponen |
| `product_id` | INT (FK) | Relasi ke Produk |
| `component_type` | ENUM | bahan_baku, tenaga_kerja, overhead |
| `cost_per_unit` | DECIMAL | Harga per porsi |

---

## 4. Rekomendasi Business Analyst
1.  **Quick Start Templates:** Sediakan template untuk bisnis kopi, baju, dll untuk mempermudah pemula.
2.  **What-If Analysis:** Fitur simpan draf skenario (Bahan Premium vs Standar).
3.  **Local Currency:** Fokus eksklusif pada **IDR (Rupiah)** untuk pasar Indonesia.
