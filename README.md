# ☕ Kopi Kazu POS v2.4 — Web Point of Sale & Recipe Auto-Deduct Inventory System

Aplikasi kasir kedai kopi (*Point of Sale*) dan manajemen stok bahan baku presisi berbasis resep (*recipe-based auto-deduct inventory*) yang dibangun dengan arsitektur Full-Stack Monorepo: **Express TypeScript** (Backend) dan **React TypeScript + Vite** (Frontend).

---

## 🏗️ Arsitektur Proyek & Tech Stack

```text
Kopi_Kazu_Web/
├── backend/                  # RESTful API Service (Node.js + Express + TypeScript)
│   ├── database/             # Skema SQL, Seeding data, & Konfigurasi User
│   │   ├── schema.sql        # 7 Tabel Utama (InnoDB Relational Schema)
│   │   ├── seed.sql          # Inisialisasi Cabang, Pengguna, Menu, Bahan, & Resep
│   │   └── user.sql          # Hak Akses & User DB
│   ├── src/
│   │   ├── index.ts          # Server Express & Rute API
│   │   ├── db.ts             # MySQL2 Connection Pool + ACID Transaction Simulator
│   │   ├── controller/       # Pengguna & Produk Controllers
│   │   ├── repository/       # Layer Akses Data & ACID Auto-Deduct Query
│   │   ├── models/           # Strict TypeScript Interfaces
│   │   ├── middleware/       # Error Handling & Validasi
│   │   └── routes/           # Endpoints Routing
│   ├── .env                  # Port & Kredensial MySQL
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Client UI SPA (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── api/              # API Client (Fetch Client, Pengguna, Produk)
│   │   ├── components/       # Layout (Header, Sidebar, LayoutAdmin) & UI (FormProduk, Toast)
│   │   ├── models/           # TypeScript Types & Interfaces (Aligned with SQL)
│   │   ├── pages/
│   │   │   ├── HalamanLogin.tsx      # Split-Screen Auth (Email & PIN Kasir)
│   │   │   ├── HalamanRegister.tsx   # Pendaftaran Mitra & Cabang Baru
│   │   │   └── admin/
│   │   │       ├── Beranda.tsx           # Terminal Kasir POS & Auto-Deduct Cart
│   │   │       ├── HalamanProduk.tsx     # KPI Widgets, Restock Alert, & Data Table
│   │   │       ├── HalamanPengguna.tsx   # Kelola Tim Barista & Otorisasi
│   │   │       └── HalamanPengaturan.tsx # Pengaturan Cabang & Sistem
│   │   ├── styles/           # Modular CSS (base.css, admin.css, form.css)
│   │   ├── App.tsx           # React Router & Toast Provider
│   │   └── main.tsx
│   ├── vite.config.ts        # Path alias '@' & Proxy '/api' ke Backend (Port 3000)
│   └── package.json
└── docs/                     # PRD, ERD, Spesifikasi Desain UI/UX, & Checklist TODO
```

---

## 🎨 Design Tokens & UI Rules

| Elemen | Token CSS / Hex Code | Penggunaan |
| :--- | :--- | :--- |
| **Primary Action** | `#1E40AF` (Royal Blue) | Header aktif, tombol utama, border navigasi |
| **Secondary Accent** | `#964B00` (Coffee Brown) | Tombol `+ Tambah Pesanan` pada grid katalog menu POS |
| **Success / Online** | `#10B981` (Emerald Green) | Badge `● Sistem Online`, status stok `Aman` |
| **Warning / Alert** | `#F59E0B` (Amber Gold) | Peringatan stok bahan mentah `Menipis` |
| **Danger / Critical** | `#EF4444` (Crimson Red) | Badge stok `Kritis`, peringatan restock darurat |
| **Page Background** | `#F8FAFC` (Slate Tint) | Latar belakang seluruh halaman aplikasi |
| **Container Card** | `#FFFFFF` (Pure White) | Kartu menu, panel keranjang, panel modal |
| **Typography** | `Plus Jakarta Sans` & `Inter` | Headings & Button labels (`Plus Jakarta Sans`), Body & Data Table (`Inter`) |

---

## ⚡ Fitur Utama

1. **Terminal Kasir POS Responsif:**
   - Pencarian real-time dan penyaringan berbasis kategori (*Espresso*, *Milk-Based*, *Non-Coffee*, *Pastry*).
   - Pengalihan tipe pesanan (*Dine In* / *Take Away*).
   - Keranjang belanja kasir interaktif dengan kontrol jumlah porsi (`+` / `-`) dan kalkulasi subtotal otomatis.
   - Pilihan metode pembayaran modern (*QRIS Instant* / *Tunai*).

2. **Recipe-Based Auto-Deduct Inventory (ACID Transaction):**
   - Setiap transaksi checkout kasir menjalankan transaksi database atomik:
     ```sql
     UPDATE bahan_baku b 
     JOIN resep r ON b.id_bahan = r.id_bahan 
     SET b.stok_tersisa = b.stok_tersisa - (r.takaran * ?) 
     WHERE r.id_menu = ?
     ```
   - Secara presisi memotong persediaan fisik bahan baku (contoh: 1 Kopi Susu Kazu memotong 18g Biji Kopi, 150ml Susu Segar, dan 25ml Sirup Aren).
   - Peringatan dini otomatis (*Low Stock Toast Alert*) jika `stok_tersisa <= stok_minimal`.

3. **Manajemen Produk & Resep Dinamis:**
   - Formulir input 2-kolom dengan penambahan bahan mentah dinamis takaran per porsi (gram/ml/pcs).
   - Estimasi kapasitas porsi maksimal menu terhitung otomatis berdasarkan ketersediaan bahan baku terendah.

4. **Autentikasi Fleksibel & Multi-Role:**
   - Mode masuk ganda: *Email & Kata Sandi* untuk Owner Kafe dan *6-Digit PIN Kasir* untuk Barista.
   - Pendaftaran mitra kafe dan cabang baru.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** (v18+)
- **MySQL** (Opsional — Backend sudah dilengkapi dengan *in-memory transaction simulator* jika MySQL lokal belum diaktifkan).

### 2. Konfigurasi Basis Data (Jika menggunakan MySQL)
Jalankan berkas SQL di folder `backend/database/`:
```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

### 3. Menjalankan Backend Express
```bash
cd backend
npm install
npm run dev
# Server aktif pada http://localhost:3000
```

### 4. Menjalankan Frontend React (Vite)
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
# Vite dev server aktif pada http://localhost:5173
```
Buka peramban ke **http://localhost:5173**. Semua permintaan `/api` akan secara otomatis diteruskan (*proxied*) ke server backend.

---

## 🔑 Akun Demo Cepat
- **Owner (Email):** `owner@kopikazu.com` / Kata Sandi: `password123`
- **Barista (PIN Cepat):** `654321`
- **Cabang Default:** *Kazu Cafe - Babelan*

