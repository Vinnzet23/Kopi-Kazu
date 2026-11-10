# Product Requirement Document (PRD) — Kopi Kazu POS v2.4

## 1. Ringkasan Produk
**Kopi Kazu** adalah aplikasi Point of Sale (POS) dan manajemen inventaris berbasis web yang dirancang khusus untuk kedai kopi. Solusi utama yang ditawarkan adalah pelacakan persediaan bahan baku secara *real-time* berbasis resep (*recipe-based auto-deduct inventory*), sehingga mencegah kehabisan stok bahan saat jam sibuk dan menghilangkan pencatatan stok manual yang tidak akurat.

---

## 2. Target Pengguna & Hak Akses
* **Owner / Manager Kafe:** Memiliki akses penuh untuk mengelola katalog menu, mendaftarkan resep bahan baku, mengatur stok mentah, memantau *low stock alert*, dan melihat laporan penjualan.
* **Barista / Kasir:** Memiliki akses operasional untuk memproses checkout transaksi, memilih metode pembayaran, serta memantau estimasi sisa porsi menu yang siap diproduksi.

---

## 3. Alur Program (User Flow)

```text
[ Halaman Auth ] ───► Login (login.html) / Register (register.html)
                             │
                             ▼
[ Navbar Utama ] ───► Terminal Kasir (proses.html)
                             │
                             ├───► Kelola Menu & Resep (form.html)
                             │
                             └───► Daftar Stok & Inventaris (index.html)
```

1. **Alur Autentikasi:**
   * Pengguna baru melakukan pendaftaran cabang melalui `register.html`.
   * Staff/Owner masuk melalui `login.html` menggunakan email/password atau PIN Kasir.
2. **Alur Transaksi & Pemotongan Stok Otomatis:**
   * Kasir membuka `proses.html` dan memilih item menu yang dipesan pelanggan.
   * Kasir memproses pembayaran (Tunai / QRIS).
   * Backend mengkalkulasi resep menu terkait dan memotong saldo `bahan_baku` secara otomatis di basis data.
   * Jika stok bahan baku setelah dipotong berada di bawah threshold `stok_minimal`, sistem memicu indikator *Low Stock Alert*.
3. **Alur Manajemen Menu & Resep:**
   * Owner membuka `form.html` untuk menambahkan produk baru.
   * Owner mengaitkan produk tersebut dengan bahan baku mentah beserta dosis per porsi (contoh: 1 Kopi Susu = 18 gram Biji Kopi + 150 ml Susu Segar).

---

## 4. Kebutuhan Fungsional (Functional Requirements)

| ID | Modul | Deskripsi Kebutuhan |
| :--- | :--- | :--- |
| **FR-01** | **Autentikasi** | Sistem harus mendukung Login multi-role (Owner & Barista), pendaftaran cabang, dan fitur PIN cepat. |
| **FR-02** | **Stok Bahan Baku** | Sistem wajib mencatat bahan baku mentah dalam satuan presisi (gram, ml, pcs) dan menampilkan peringatan stok kritis (*Low Stock Alert*). |
| **FR-03** | **Manajemen Resep** | Sistem harus memungkinkan relasi *many-to-many* antara 1 menu jadi dengan beberapa bahan baku mentah (BOM - *Bill of Materials*). |
| **FR-04** | **Terminal POS** | Sistem harus menyediakan antarmuka checkout cepat dengan pemilihan kategori, perhitungan subtotal, diskon, dan metode pembayaran. |
| **FR-05** | **Auto-Deduction** | Sistem harus menjalankan pemotongan stok bahan baku secara atomically (*database transaction*) saat checkout berhasil. |

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Responsivitas:** Tampilan web fleksibel dari layar tablet hingga desktop (desain mobile-first & responsive grid).
* **Performa:** Respons pemrosesan transaksi di bawah 1 detik per *checkout*.
* **Keamanan:** Hash enkripsi kata sandi pengguna (bcrypt/argon2) dan autentikasi berbasis sesi/JWT.