# TODO List Pengembangan Full-Stack Kopi Kazu POS v2.4

---

## 🛠️ Fase 1: Environment & Database Setup
- [x] **Inisialisasi Project Repo**
  - [x] Buat struktur folder proyek (`backend/`, `frontend/`, `docs/`).
  - [x] Setup dependency utama (`express`, `mysql2`, `dotenv`, `bcryptjs`, `react`, `vite`, `lucide-react`, `react-router`).
- [x] **Setup Database MySQL**
  - [x] Buat database `db_kopi_kazu`.
  - [x] Eksekusi script DDL dari `schema.sql` (Tabel: `cabang`, `pengguna`, `bahan_baku`, `menu`, `resep`, `transaksi`, `detail_transaksi`).
  - [x] Masukkan data dummy (*seeding*) pada `seed.sql` untuk cabang utama, akun owner/barista, 6 bahan baku, dan 5 menu awal beserta resep.
- [x] **Setup CSS Global (`frontend/src/styles/base.css`)**
  - [x] Deklarasikan variabel `:root` dari spesifikasi UI (`--warna-utama: #1E40AF`, `--warna-aksen-kopi: #964B00`, `--warna-sukses: #10B981`, dll).
  - [x] Buat styling dasar untuk reset CSS, typography (*Plus Jakarta Sans* & *Inter*), tombol (`.btn-primary`, `.btn-accent`), badge status, dan form kontrol.

---

## 🔐 Fase 2: Autentikasi & Gerbang Masuk (`HalamanLogin.tsx` & `HalamanRegister.tsx`)
- [x] **Antarmuka Auth**
  - [x] Sempurnakan layout split-screen 50:50 pada `HalamanLogin.tsx` (Email/Pass, PIN Cepat Kasir, Demo credentials helper).
  - [x] Sempurnakan layout split-screen `HalamanRegister.tsx` (Form Mitra Kafe & Cabang).
- [x] **Backend Auth API**
  - [x] Buat endpoint `POST /api/pengguna/register` (hashing password dengan bcrypt).
  - [x] Buat endpoint `POST /api/pengguna/login` (dukungan verifikasi email/password dan PIN kasir).
  - [x] Hubungkan form auth dengan API client frontend & navigasi otomatis ke `/admin/beranda`.

---

## 💻 Fase 3: Pengembangan 3 Halaman Utama (Frontend UI)
- [x] **Halaman 1: Dashboard & Stok (`HalamanProduk.tsx`)**
  - [x] Buat struktur header dengan badge status (`● Sistem Online`, `Cabang: Kazu Cafe - Babelan (Aktif)`).
  - [x] Buat komponen widget KPI & *Low Stock Alert* (pemicu warna merah `--warna-kritis` jika stok <= `stok_minimal`).
  - [x] Buat tabel daftar produk beserta sisa porsi, resep ringkas, dan tombol `+ Tambah Produk`.
- [x] **Halaman 2: Input Menu & Resep (`FormProduk.tsx`)**
  - [x] Buat form input data menu dasar (Nama Menu, Kategori, Harga Jual).
  - [x] Buat seksi dinamis *Komposisi Resep* (pilih bahan baku, masukan takaran dosis gram/ml per cup, hapus baris, tambah baris).
  - [x] Buat tombol aksi `Simpan Produk & Aktifkan` dan `Batal`.
- [x] **Halaman 3: Terminal Checkout POS (`Beranda.tsx`)**
  - [x] Buat grid katalog menu berbasis filter kategori (Espresso, Milk-Based, Non-Coffee, Pastry) dengan tombol aksen kopi `#964B00`.
  - [x] Buat panel keranjang belanja (*cart sidebar*) dengan kontrol jumlah porsi (+/-).
  - [x] Buat pemilih metode pembayaran (Tunai / QRIS) dan kalkulasi total transaksi.

---

## ⚙️ Fase 4: Logika Backend & Auto-Deduct Inventory
- [x] **API Master Data (CRUD)**
  - [x] Endpoint `GET /api/produk/menu`, `POST /api/produk/menu`, `PUT /api/produk/menu/:id`, `DELETE /api/produk/menu/:id` (termasuk relasi resep ke bahan baku).
  - [x] Endpoint `GET /api/produk/bahan` & `GET /api/produk/bahan/kritis` (inventaris bahan mentah & alert).
- [x] **Logika Inti Transaction & Auto-Deduction**
  - [x] Buat endpoint `POST /api/produk/checkout`.
  - [x] Implementasikan **Database Transaction** (ACID):
    1. Insert data ke tabel `transaksi`.
    2. Insert item ke tabel `detail_transaksi`.
    3. Update pemotongan stok bahan baku berdasar takaran resep:
       `UPDATE bahan_baku b JOIN resep r ON b.id_bahan = r.id_bahan SET b.stok_tersisa = b.stok_tersisa - (r.takaran * ?) WHERE r.id_menu = ?`
    4. Cek threshold stok menipis dan kembalikan array `peringatan_stok` untuk memicu toast notification.

---

## 🧪 Fase 5: Pengujian, Responsivitas & Dokumentasi Repo
- [x] **Pengujian Respon & Validasi Flexbox / Grid**
  - [x] Responsivitas tampilan tablet hingga desktop dengan CSS media queries dan layout fleksibel.
  - [x] Uji fitur *Auto-Deduct*: Penjualan 2 porsi Kopi Susu Kazu otomatis memotong Biji Kopi, Susu, dan Sirup Aren, serta mengurangi estimasi sisa porsi dari 33 menjadi 31.
- [x] **Dokumentasi & Build**
  - [x] Buat dokumentasi komprehensif pada `README.md`.
  - [x] Validasi TypeScript build pada backend (`npm --prefix backend run build`) dan frontend (`npm --prefix frontend run build`).
  - [x] Tambahkan Auto-Migration (`autoMigrateDatabase`) di `db.ts` — otomatis membuat tabel & seed saat backend pertama kali terhubung ke MySQL (fix: `Table 'kasirku.transaksi' doesn't exist`).
