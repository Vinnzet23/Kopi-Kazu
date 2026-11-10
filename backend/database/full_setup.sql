-- =======================================================
-- Kopi Kazu POS v2.4 - Full Database Setup (Schema + Seed)
-- Jalankan file ini langsung di phpMyAdmin (Tab SQL)
-- atau via terminal: mysql -u root -p < full_setup.sql
-- =======================================================

-- 1. Buat Database jika belum ada
CREATE DATABASE IF NOT EXISTS db_kopi_kazu;
USE db_kopi_kazu;

-- 2. Hapus tabel lama jika ingin reset total (urutan child dulu baru parent)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS detail_transaksi;
DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS resep;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS bahan_baku;
DROP TABLE IF EXISTS pengguna;
DROP TABLE IF EXISTS cabang;
SET FOREIGN_KEY_CHECKS = 1;

-- =======================================================
-- TABEL
-- =======================================================

-- 1. Cabang
CREATE TABLE cabang (
    id_cabang INT AUTO_INCREMENT PRIMARY KEY,
    nama_cabang VARCHAR(100) NOT NULL,
    alamat TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Pengguna
CREATE TABLE pengguna (
    id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pin_kasir VARCHAR(6) NULL,
    peran ENUM('owner', 'barista') DEFAULT 'barista',
    id_cabang INT NOT NULL,
    FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bahan Baku
CREATE TABLE bahan_baku (
    id_bahan INT AUTO_INCREMENT PRIMARY KEY,
    nama_bahan VARCHAR(100) NOT NULL,
    stok_tersisa DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    satuan VARCHAR(20) NOT NULL,
    stok_minimal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    id_cabang INT NOT NULL,
    FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Menu
CREATE TABLE menu (
    id_menu INT AUTO_INCREMENT PRIMARY KEY,
    nama_menu VARCHAR(100) NOT NULL,
    kategori ENUM('espresso', 'milk_based', 'non_coffee', 'pastry') NOT NULL,
    harga_jual DECIMAL(10,2) NOT NULL,
    id_cabang INT NOT NULL,
    FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Resep
CREATE TABLE resep (
    id_resep INT AUTO_INCREMENT PRIMARY KEY,
    id_menu INT NOT NULL,
    id_bahan INT NOT NULL,
    takaran DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_menu) REFERENCES menu(id_menu) ON DELETE CASCADE,
    FOREIGN KEY (id_bahan) REFERENCES bahan_baku(id_bahan) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Transaksi
CREATE TABLE transaksi (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    kode_transaksi VARCHAR(50) NOT NULL UNIQUE,
    id_pengguna INT NOT NULL,
    total_harga DECIMAL(10,2) NOT NULL,
    metode_bayar ENUM('tunai', 'qris') NOT NULL,
    tanggal_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Detail Transaksi
CREATE TABLE detail_transaksi (
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_transaksi INT NOT NULL,
    id_menu INT NOT NULL,
    jumlah_porsi INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_transaksi) REFERENCES transaksi(id_transaksi) ON DELETE CASCADE,
    FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================================================
-- SEED DATA
-- =======================================================

-- 1. Cabang
INSERT INTO cabang (id_cabang, nama_cabang, alamat) VALUES
(1, 'Kazu Cafe - Babelan', 'Jl. Babelan Raya No. 42, Babelan, Bekasi');

-- 2. Pengguna (Password: 'password123' untuk owner, 'barista123' untuk barista)
INSERT INTO pengguna (id_pengguna, nama, email, password, pin_kasir, peran, id_cabang) VALUES
(1, 'Axel Kazu', 'owner@kopikazu.com', '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', '123456', 'owner', 1),
(2, 'Barista Axel', 'barista@kopikazu.com', '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', '654321', 'barista', 1);

-- 3. Bahan Baku
INSERT INTO bahan_baku (id_bahan, nama_bahan, stok_tersisa, satuan, stok_minimal, id_cabang) VALUES
(1, 'Biji Kopi House Blend', 2500.00, 'gram', 500.00, 1),
(2, 'Susu Segar Greenfield', 5000.00, 'ml', 1000.00, 1),
(3, 'Sirup Aren Organik', 1200.00, 'ml', 300.00, 1),
(4, 'Bubuk Matcha Uji', 800.00, 'gram', 200.00, 1),
(5, 'Butter Croissant Dough', 15.00, 'pcs', 5.00, 1),
(6, 'Sirup Karamel Monin', 250.00, 'ml', 300.00, 1);

-- 4. Menu
INSERT INTO menu (id_menu, nama_menu, kategori, harga_jual, id_cabang) VALUES
(1, 'Kopi Susu Kazu', 'milk_based', 22000.00, 1),
(2, 'Espresso Single Origin', 'espresso', 18000.00, 1),
(3, 'Matcha Latte Ice', 'non_coffee', 25000.00, 1),
(4, 'Caramel Macchiato', 'milk_based', 28000.00, 1),
(5, 'Butter Croissant', 'pastry', 24000.00, 1);

-- 5. Resep
INSERT INTO resep (id_resep, id_menu, id_bahan, takaran) VALUES
(1, 1, 1, 18.00),
(2, 1, 2, 150.00),
(3, 1, 3, 25.00),
(4, 2, 1, 18.00),
(5, 3, 4, 20.00),
(6, 3, 2, 180.00),
(7, 4, 1, 18.00),
(8, 4, 2, 150.00),
(9, 4, 6, 20.00),
(10, 5, 5, 1.00);

