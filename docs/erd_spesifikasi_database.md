# Entity Relationship Diagram & Database Spec — Kopi Kazu

## 1. Diagram Hubungan Entitas (Logical Schema)

```text
  +------------------+         +-------------------+         +-------------------+
  |      CABANG      |         |     PENGGUNA      |         |     BAHAN_BAKU    |
  +------------------+         +-------------------+         +-------------------+
  | PK  id_cabang    |<-------1| PK  id_pengguna   |         | PK  id_bahan      |
  |     nama_cabang  |  (1:N)  |     nama          |         |     nama_bahan    |
  |     alamat       |         |     email         |         |     stok_tersisa  |
  +------------------+         |     password      |         |     satuan        |
           │                   |     peran         |         |     stok_minimal  |
           │                   | FK  id_cabang     |         | FK  id_cabang     |
           │                   +-------------------+         +-------------------+
           │                             │                             ▲
           │                             │                             │
           │ (1:N)                       │ (1:N)                       │ (1:N)
           ▼                             ▼                             │
  +------------------+         +-------------------+         +-------------------+
  |       MENU       |         |     TRANSAKSI     |         |       RESEP       |
  +------------------+         +-------------------+         +-------------------+
  | PK  id_menu      |         | PK  id_transaksi  |         | PK  id_resep      |
  |     nama_menu    |         |     kode_transaksi|         | FK  id_menu       |──┐
  |     kategori     |         |     total_harga   |         | FK  id_bahan      |  │
  |     harga_jual   |         |     metode_bayar  |         |     takaran       |  │
  | FK  id_cabang    |         |     tanggal       |         +-------------------+  │
  +------------------+         | FK  id_pengguna   |                            │
           ▲                   +-------------------+                            │
           │                             │                                      │
           │                             │ (1:N)                                │
           │ (1:N)                       ▼                                      │
           │                   +-------------------+                            │
           └-------------------|  DETAIL_TRANSAKSI |                            │
                               +-------------------+                            │
                               | PK  id_detail     |                            │
                               | FK  id_transaksi  |                            │
                               | FK  id_menu       |<---------------------------┘
                               |     jumlah_porsi  |
                               |     subtotal      |
                               +-------------------+
```

---

## 2. Detail Kamus Data (Table Definitions)

### 1. Tabel `cabang`
* **`id_cabang`** (INT, PK, Auto Increment) — Identifier unik lokasi cabang kafe.
* **`nama_cabang`** (VARCHAR 100) — Contoh: "Kazu Cafe - Babelan".
* **`alamat`** (TEXT) — Alamat operasional cabang.

### 2. Tabel `pengguna`
* **`id_pengguna`** (INT, PK, Auto Increment) — Identifier akun pengguna.
* **`nama`** (VARCHAR 100) — Nama lengkap pengguna/barista.
* **`email`** (VARCHAR 100, Unique) — Email login bisnis.
* **`password`** (VARCHAR 255) — Hashed password.
* **`pin_kasir`** (VARCHAR 6, Nullable) — PIN login cepat terminal kasir.
* **`peran`** (ENUM('owner', 'barista')) — Hak akses pengguna.
* **`id_cabang`** (INT, FK -> `cabang.id_cabang`).

### 3. Tabel `bahan_baku`
* **`id_bahan`** (INT, PK, Auto Increment) — Identifier unik bahan mentah.
* **`nama_bahan`** (VARCHAR 100) — Contoh: "Biji Kopi Arabika", "Susu Segar UHT".
* **`stok_tersisa`** (DECIMAL 10,2) — Sisa fisik persediaan (misal: 1500.00).
* **`satuan`** (VARCHAR 20) — Satuan pengukuran ("gram", "ml", "pcs").
* **`stok_minimal`** (DECIMAL 10,2) — Threshold pemicu *Low Stock Alert*.
* **`id_cabang`** (INT, FK -> `cabang.id_cabang`).

### 4. Tabel `menu`
* **`id_menu`** (INT, PK, Auto Increment) — Identifier produk menu.
* **`nama_menu`** (VARCHAR 100) — Contoh: "Kopi Susu Kazu".
* **`kategori`** (ENUM('espresso', 'milk_based', 'non_coffee', 'pastry')) — Kategori menu.
* **`harga_jual`** (DECIMAL 10,2) — Harga per porsi menu.
* **`id_cabang`** (INT, FK -> `cabang.id_cabang`).

### 5. Tabel `resep` (Bridge Table BOM: `menu` <-> `bahan_baku`)
* **`id_resep`** (INT, PK, Auto Increment) — Identifier relasi resep.
* **`id_menu`** (INT, FK -> `menu.id_menu`) — Produk menu jadi.
* **`id_bahan`** (INT, FK -> `bahan_baku.id_bahan`) — Bahan mentah yang dipakai.
* **`takaran`** (DECIMAL 10,2) — Jumlah bahan yang terpotong per 1 porsi (contoh: 18.00 gram).

### 6. Tabel `transaksi`
* **`id_transaksi`** (INT, PK, Auto Increment) — Identifier unik transaksi.
* **`kode_transaksi`** (VARCHAR 50, Unique) — Format nota, misal: `TRX-20261107-001`.
* **`id_pengguna`** (INT, FK -> `pengguna.id_pengguna`) — Kasir yang bertugas.
* **`total_harga`** (DECIMAL 10,2) — Total pembayaran transaksi.
* **`metode_bayar`** (ENUM('tunai', 'qris')) — Metode transaksi.
* **`tanggal_transaksi`** (DATETIME) — Waktu transaksi dibuat.

### 7. Tabel `detail_transaksi`
* **`id_detail`** (INT, PK, Auto Increment) — Identifier baris detail pesanan.
* **`id_transaksi`** (INT, FK -> `transaksi.id_transaksi`).
* **`id_menu`** (INT, FK -> `menu.id_menu`).
* **`jumlah_porsi`** (INT) — Jumlah porsi dibeli (misal: 2 cup).
* **`subtotal`** (DECIMAL 10,2) — Total harga per item menu.

---

## 3. DDL Script Database SQL (`db_kopi_kazu.sql`)

```sql
CREATE DATABASE IF NOT EXISTS db_kopi_kazu;
USE db_kopi_kazu;

CREATE TABLE cabang (
    id_cabang INT AUTO_INCREMENT PRIMARY KEY,
    nama_cabang VARCHAR(100) NOT NULL,
    alamat TEXT
) ENGINE=InnoDB;

CREATE TABLE pengguna (
    id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pin_kasir VARCHAR(6),
    peran ENUM('owner', 'barista') DEFAULT 'barista',
    id_cabang INT NOT NULL,
    FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE bahan_baku (
    id_bahan INT AUTO_INCREMENT PRIMARY KEY,
    nama_bahan VARCHAR(100) NOT NULL,
    stok_tersisa DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    satuan VARCHAR(20) NOT NULL,
    stok_minimal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    id_cabang INT NOT NULL,
    FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE menu (
    id_menu INT AUTO_INCREMENT PRIMARY KEY,
    nama_menu VARCHAR(100) NOT NULL,
    kategori ENUM('espresso', 'milk_based', 'non_coffee', 'pastry') NOT NULL,
    harga_jual DECIMAL(10,2) NOT NULL,
    id_cabang INT NOT NULL,
    FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE resep (
    id_resep INT AUTO_INCREMENT PRIMARY KEY,
    id_menu INT NOT NULL,
    id_bahan INT NOT NULL,
    takaran DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_menu) REFERENCES menu(id_menu) ON DELETE CASCADE,
    FOREIGN KEY (id_bahan) REFERENCES bahan_baku(id_bahan) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE transaksi (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    kode_transaksi VARCHAR(50) NOT NULL UNIQUE,
    id_pengguna INT NOT NULL,
    total_harga DECIMAL(10,2) NOT NULL,
    metode_bayar ENUM('tunai', 'qris') NOT NULL,
    tanggal_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna)
) ENGINE=InnoDB;

CREATE TABLE detail_transaksi (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_transaksi INT NOT NULL,
    id_menu INT NOT NULL,
    jumlah_porsi INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_transaksi) REFERENCES transaksi(id_transaksi) ON DELETE CASCADE,
    FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
) ENGINE=InnoDB;
```