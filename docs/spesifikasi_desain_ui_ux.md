# DESIGN.md — Design Tokens & UI Specs (Kopi Kazu POS v2.4)

Dokumen ini berisi standar token desain, panduan komponen antarmuka (UI), serta hierarki visual yang diekstrak langsung dari mockup 5 halaman utama aplikasi **Kopi Kazu POS v2.4**.

---

## 1. Color Tokens (`:root`)

```css
:root {
  /* Brand Primary & Accents */
  --warna-utama: #1E40AF;          /* Royal Blue - Header active, primary actions, badges */
  --warna-utama-hover: #1D4ED8;    /* Darker Royal Blue - State hover button */
  --warna-aksen-kopi: #964B00;     /* Coffee Brown - Tombol "+ Tambah" grid menu kasir */
  --warna-latar: #F8FAFC;          /* Soft Grayish Blue - Latar belakang utama aplikasi */
  --warna-kartu: #FFFFFF;          /* White - Container kartu, modal, & panel form */
  --warna-border: #E2E8F0;         /* Soft Border - Outline input & pemisah section */

  /* Neutral Text Colors */
  --warna-teks-gelap: #0F172A;     /* Slate Dark - Heading 1 & 2, nominal harga utama */
  --warna-teks: #475569;           /* Slate Medium - Text body, label form, deskripsi */
  --warna-teks-muat: #94A3B8;      /* Slate Light - Placeholder, caption, info sekunder */

  /* Status Badges & Alerts */
  --warna-sukses: #10B981;        /* Emerald Green - "Sistem Online", "Aman", indicator stok */
  --warna-sukses-bg: #ECFDF5;     /* Light Green Tint - Latar badge status aman */
  
  --warna-peringatan: #F59E0B;     /* Amber Yellow - "Menipis", "Perhatian" */
  --warna-peringatan-bg: #FFFBEB;  /* Light Amber Tint - Banner perhatian restock */

  --warna-kritis: #EF4444;        /* Red Crimson - "Low Stock Alert", "Bahan Kritis", error */
  --warna-kritis-bg: #FEF2F2;     /* Light Red Tint - Banner stok kritis */

  --warna-kategori-bg: #EEF2FF;   /* Soft Lavender Tint - Badge kategori "Milk-Based" */
  --warna-kategori-teks: #4F46E5; /* Soft Indigo - Teks badge kategori */

  /* Layout & Spacing */
  --jarak-dasar: 8px;              /* Grid dasar 8-point */
  --sudut-kartu: 12px;             /* Radius standar kartu, input field, & tombol */
  --sudut-pill: 20px;              /* Radius pill badge & toggle status */
  --bayangan-kartu: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(15, 98, 254, 0.04);
}
```

---

## 2. Tipografi (Typography System)

Aplikasi menggunakan dua font Google Fonts: **Plus Jakarta Sans** (Judul/Headings) dan **Inter** (Teks/Body).

| Elemen | Font Family | Ukuran | Weight | Warna |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Page Title)** | `Plus Jakarta Sans` | 24px | Bold (700) | `--warna-teks-gelap` |
| **H2 (Section Header)** | `Plus Jakarta Sans` | 18px | SemiBold (600) | `--warna-teks-gelap` |
| **H3 (Card Title / Sub)** | `Plus Jakarta Sans` | 15px | SemiBold (600) | `--warna-teks-gelap` |
| **Body (Normal)** | `Inter` | 14px | Regular (400) | `--warna-teks` |
| **Body (Medium/Label)** | `Inter` | 14px | Medium (500) | `--warna-teks-gelap` |
| **Caption / Subtitle** | `Inter` | 12px | Regular (400) | `--warna-teks-muat` |
| **Price Tag (POS Grid)**| `Plus Jakarta Sans` | 15px | Bold (700) | `--warna-teks-gelap` |

---

## 3. Tata Letak & Navigasi (Layout Specs)

### 3.1 Header Navigasi Atas (`<header>`)
* **Tinggi Header:** `64px` dengan latar belakang putih (`#FFFFFF`) dan border bawah `1px solid --warna-border`.
* **Kiri:** Logo Kopi Kazu + Badge `POS v2.4`.
* **Tengah:** Navigasi Tab (`Daftar Produk`, `Form Input`, `Terminal Kasir`). Tab aktif menggunakan border-bottom `2px solid --warna-utama` dan warna teks `--warna-utama`.
* **Kanan:** Badge Status `● Sistem Online`, Pill Cabang `Cabang: Kazu Cafe - Babelan (Aktif)`, Ikon Notifikasi, Ikon Setting, dan Profil Avatar User (`Barista Axel`).

### 3.2 Halaman Autentikasi (`login.html` & `register.html`)
* **Layout:** Split-screen (50% Kiri : 50% Kanan).
* **Sisi Kiri:** Soft gradient background dengan ilustrasi Maskot Kopi Kazu lingkaran, judul slogan *"Kelola Kafe Jadi Lebih Santai"*, dan deskripsi pendukung.
* **Sisi Kanan:** Form Card terpusat secara vertikal & horizontal.

---

## 4. Komponen Spesiﬁk per Layar

### 4.1 Layar 1: Daftar Produk & Inventaris (`index.html`)
1. **KPI Summary Widgets (Atas Kanan):**
   * Kartu Ringkasan: Total Menu Aktif (`5 Menu`), Bahan Kritis (`3 Bahan` - Red Tint), Total Porsi Tersedia (`120 Porsi`).
2. **Restock Warning Banner:**
   * Latar `--warna-latar` dengan border radius `12px`. Menampilkan kartu bahan mentah kritis (misal: *Biji Kopi House Blend*, *Susu Segar Greenfield*, *Sirup Karamel Monin*) lengkap dengan sisa porsi dan estimasi porsi terpakai (`-14 cup`).
3. **Filter & Action Bar:**
   * Kolom cari ber-ikon (Search Bar), Dropdown Kategori, Dropdown Status, dan Tombol Utama `+ Tambah Produk` (Royal Blue `#1E40AF`).
4. **Data Table produk:**
   * Header tabel berwarna abu-abu muda (`#F8FAFC`).
   * Kolom: Gambar Produk, Nama & SKU, Kategori (Badge Lavender), Harga Jual, Komposisi Kunci (Resep singkat), Estimasi Porsi Sisa (Progress Bar + Badge Status Aman/Menipis), Switch Toggle (Aktif/Nonaktif), dan Tombol Aksi (Edit, Copy, Delete).

### 4.2 Layar 2: Form Input Menu & Resep (`form.html`)
1. **Layout 2-Kolom Grid:**
   * **Kolom Kiri (Informasi Dasar Produk):** Field Nama Produk, Dropdown Kategori, SKU, Input Harga Jual & HPP (Modal) dengan Margin Profit calculator (% auto), Deskripsi, Status Ketersediaan (Radio Button), dan Zone Dropzone Upload Foto.
   * **Kolom Kanan (Komposisi Resep & Auto-Deduct Stok):** Banner Info `Auto-Deduct Real-time`, Tabel Input Resep Dinamis (Dropdown Bahan Baku, Input Takaran, Dropdown Satuan `gram`/`ml`/`pcs`, Estimasi Modal Rp, Tombol Hapus Row), Tombol `+ Tambah Bahan Resep Lainnya`, dan Card Ringkasan Total HPP Resep & Kapasitas Porsi Maksimal.
2. **Bottom Floating Action Bar:**
   * Menempel di bawah: Status Draf Verifikasi, Tombol `Batal` (Outlined), `Simpan sebagai Draf` (Secondary Light Blue), dan `Simpan Produk & Aktifkan` (Primary Royal Blue).

### 4.3 Layar 3: Terminal Kasir Checkout (`proses.html`)
1. **Sisi Kiri (Katalog Menu POS Grid):**
   * Bar Pencarian & Switcher Tipe (`Dine In` / `Take Away`).
   * Category Filter Pills (`Semua Menu`, `Kopi Susu`, `Black Coffee`).
   * Cards Grid (2-4 kolom): Foto Produk, Badge Sisa Porsi Top-Left (Hijau `Sisa 20 Porsi`), Nama Menu, Deskripsi Singkat, Harga, dan Tombol `+ Tambah` (Warna Cokelat Kopi `#964B00` atau Royal Blue `#1E40AF`).
2. **Sisi Kanan (Sidebar Order & Checkout Panel):**
   * Header Order: Kode Transaksi (misal `#KZ-084`), Waktu Live, No. Meja Pelanggan.
   * Daftar Item Pesanan: Nama Item, Badge Ice/Hot, Preview Potongan Bahan Baku otomatis (contoh: `-36g Biji Kopi, -240ml Susu Segar`), Input Catatan, dan Stepper Quantity (`-` `2` `+`).
   * Ringkasan Total Tagihan: Subtotal, Pajak Resto 10%, Promo Diskon, dan Total Bold Tagihan Besar (`Rp 73.700`).
   * Metode Pembayaran Tabs: `Tunai` vs `QRIS Dinamis`.
   * Quick Cash Pills: Uang Pas, `50k`, `100k`, `150k`, `200k`, perhitungan Kembalian otomatis.
   * Footer Action: Checkbox `Cetak Struk Otomatis` + Tombol Besar `Proses Pembayaran (Rp 73.700)`.

---

## 5. Ilustrasi & Asset Maskot

* **File Maskot:** Maskot Kucing Kazu memegang Cup Kopi (`screen_6.jpg` / `/assets/mascot-kazu.png`).
* **Penggunaan:** Ditampilkan di dalam lingkaran bergradasi biru-krem pada halaman `login.html` dan `register.html`.