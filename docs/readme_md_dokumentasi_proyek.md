# ☕ Kopi Kazu - Web POS & Auto-Deduct Inventory System

> **Aplikasi Kasir Kedai Kopi & Pengendalian Stok Bahan Baku Berbasis Resep**

**Kopi Kazu (v2.4)** adalah sistem *Point of Sale* (POS) dan manajemen inventaris berbasis web yang dirancang khusus untuk operasional kedai kopi. Solusi utama yang ditawarkan adalah otomatisasi pemotongan persediaan bahan baku mentah (*recipe-based auto-deduct inventory*) setiap kali transaksi checkout dilakukan, serta peringatan dini stok menipis (*Low Stock Alert*).

---

## 📸 Tampilan & Struktur Layar Aplikasi

Aplikasi terbagi dalam 3 layar inti operasional dan 2 layar autentikasi:

1. **`login.html` & `register.html`** — Gerbang autentikasi barista/owner dan pendaftaran cabang baru (*Kazu Cafe - Babelan*).
2. **`index.html` (Daftar Produk & Inventaris)** — Dashboard pemantauan sisa porsi menu, status bahan mentah, dan widget *Low Stock Alert*.
3. **`form.html` (Input Menu & Resep)** — Formulir registrasi menu baru beserta penentuan takaran bahan mentah per porsi (BOM / *Bill of Materials*).
4. **`proses.html` (Terminal Kasir / Checkout POS)** — Interface kasir untuk mencatat pesanan, memilih metode pembayaran (Tunai/QRIS), dan memicu pemotongan stok otomatis.

---

## ✨ 3 Fitur Utama (MVP)

* **🛒 Checkout POS Fast-Touch:** Kasir dapat memilih menu berdasarkan kategori (*Milk-Based*, *Espresso*, dll), menghitung subtotal dan kembalian, serta memproses pembayaran tunai maupun QRIS.
* **📦 Auto-Deduct Inventory (Potong Stok Otomatis):** Setiap 1 porsi menu terjual, sistem otomatis mengikis stok bahan baku di basis data sesuai dosis resepnya (contoh: 1 *Kopi Susu Honey* = -18g Biji Kopi, -120ml Susu, -20g Madu, -1 Cup, -1 Sedotan).
* **⚠️ Low Stock Alert:** Notifikasi visual real-time jika persediaan bahan mentah tertentu menyentuh atau berada di bawah threshold `stok_minimal`.

---

## 🛠️ Teknologi & Standar Desain

* **Frontend:** HTML5, CSS3 (Flexbox & Grid), JavaScript (ES6 Vanilla / Fetch API)
* **Backend:** Node.js, Express.js (RESTful API)
* **Database:** MySQL / MariaDB (InnoDB Transaction support)
* **Design Tokens (`DESIGN.md`):**
  * **Primary Color:** `#0F62FE` (Royal Blue)
  * **Tertiary Color:** `#198038` (Emerald Green - Status Online & Stok Aman)
  * **Alert Color:** `#DA1E28` (Crimson Red - Low Stock Warning)
  * **Background & Text:** `#F4F7FF` (Soft Blue Tint), `#525252` (Neutral Gray)
  * **Typography:** `Plus Jakarta Sans` (Judul) & `Inter` (Teks/Konten)

---

## 📂 Struktur Repositori

```text
kopikazu-pos/
├── css/
│   └── style.css            # Variabel CSS (:root) & styling global
├── js/
│   ├── app.js               # Logika frontend utama
│   └── menuData.js          # Data dummy/mockup menu & stok
├── docs/
│   └── ui/                  # Tangkapan layar antarmuka (mobile & laptop)
├── db_kopi_kazu.sql         # Script DDL database & initial seeding data
├── index.html               # Layar 1: Daftar Produk & Stok Bahan
├── form.html                # Layar 2: Input Form Produk & Takaran Resep
├── proses.html              # Layar 3: Terminal Kasir & Checkout
├── login.html               # Layar Auth: Login Kasir / PIN Cepat
├── register.html            # Layar Auth: Registrasi Mitra Kafe
├── PRD.md                   # Product Requirement Document
├── DESIGN.md                # Spesifikasi Token Desain & UI Rules
├── DATABASE.md              # Spesifikasi ERD & Kamus Data SQL
├── TODO.md                  # Checklist Tugas & Workflow Antigravity
└── README.md                # Dokumentasi utama repositori
```

---

## 🗄️ Sample Data Menu (5 Menu Utama)

| ID | Nama Menu | Kategori | Harga Jual | Sisa Stok Initial |
| :---: | :--- | :--- | :---: | :---: |
| **1** | Kopi Susu Honey | Milk-Based (`milk_based`) | Rp 22.000 | 20 porsi |
| **2** | Kopi Vanilla | Milk-Based (`milk_based`) | Rp 21.000 | 30 porsi |
| **3** | Kopi Americano | Espresso (`espresso`) | Rp 18.000 | 25 porsi |
| **4** | Kopi Peach Americano | Espresso (`espresso`) | Rp 23.000 | 35 porsi |
| **5** | Kopi Butterscotch | Milk-Based (`milk_based`) | Rp 24.000 | 15 porsi |

---

## 🚀 Panduan Memulai (Setup Environment)

### 1. Setup Database MySQL
1. Buka **phpMyAdmin** atau **MySQL Workbench**.
2. Impor atau jalankan skrip SQL dari berkas `db_kopi_kazu.sql`.
3. Pastikan 7 tabel (`cabang`, `pengguna`, `bahan_baku`, `menu`, `resep`, `transaksi`, `detail_transaksi`) berhasil terbuat beserta data awal (*seeding*).

### 2. Jalankan Backend & Frontend
1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/kopikazu-pos.git
   cd kopikazu-pos
   ```
2. Inisialisasi dan jalankan server (jika menggunakan Node.js):
   ```bash
   npm install
   npm start
   ```
3. Buka `login.html` atau `index.html` di browser favorit Anda.

---

## 📜 Lisensi & Pengembang
Proyek ini dibuat sebagai portofolio pengembangan aplikasi web *full-stack* manajemen kasir & inventaris kedai kopi.

**Tim Pengembang:** Kopi Kazu Dev Team  
**Versi:** 2.4 (Terintegrasi Auto-Deduct Inventory & Multi-Branch Support)