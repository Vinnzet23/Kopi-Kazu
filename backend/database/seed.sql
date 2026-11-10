-- Seed Data: Kopi Kazu POS v2.4
-- Berkas ini dapat dijalankan pada database 'kasirku' atau 'db_kopi_kazu'

-- USE db_kopi_kazu;

-- 1. Insert Cabang
INSERT INTO cabang (id_cabang, nama_cabang, alamat) VALUES
(1, 'Kazu Cafe - Babelan', 'Jl. Babelan Raya No. 42, Babelan, Bekasi');

-- 2. Insert Pengguna (Password default: 'password123' bcrypt hashed, 'barista123' bcrypt hashed)
INSERT INTO pengguna (id_pengguna, nama, email, password, pin_kasir, peran, id_cabang) VALUES
(1, 'Axel Kazu', 'owner@kopikazu.com', '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', '123456', 'owner', 1),
(2, 'Barista Axel', 'barista@kopikazu.com', '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', '654321', 'barista', 1);

-- 3. Insert Bahan Baku
INSERT INTO bahan_baku (id_bahan, nama_bahan, stok_tersisa, satuan, stok_minimal, id_cabang) VALUES
(1, 'Biji Kopi House Blend', 2500.00, 'gram', 500.00, 1),
(2, 'Susu Segar Greenfield', 5000.00, 'ml', 1000.00, 1),
(3, 'Sirup Aren Organik', 1200.00, 'ml', 300.00, 1),
(4, 'Bubuk Matcha Uji', 800.00, 'gram', 200.00, 1),
(5, 'Butter Croissant Dough', 15.00, 'pcs', 5.00, 1),
(6, 'Sirup Karamel Monin', 250.00, 'ml', 300.00, 1);

-- 4. Insert Menu
INSERT INTO menu (id_menu, nama_menu, kategori, harga_jual, id_cabang) VALUES
(1, 'Kopi Susu Kazu', 'milk_based', 22000.00, 1),
(2, 'Espresso Single Origin', 'espresso', 18000.00, 1),
(3, 'Matcha Latte Ice', 'non_coffee', 25000.00, 1),
(4, 'Caramel Macchiato', 'milk_based', 28000.00, 1),
(5, 'Butter Croissant', 'pastry', 24000.00, 1);

-- 5. Insert Resep (Komposisi Takaran per Porsi)
INSERT INTO resep (id_resep, id_menu, id_bahan, takaran) VALUES
-- Kopi Susu Kazu
(1, 1, 1, 18.00), -- 18g Biji Kopi
(2, 1, 2, 150.00), -- 150ml Susu Segar
(3, 1, 3, 25.00),  -- 25ml Sirup Aren
-- Espresso Single Origin
(4, 2, 1, 18.00), -- 18g Biji Kopi
-- Matcha Latte Ice
(5, 3, 4, 20.00),  -- 20g Bubuk Matcha
(6, 3, 2, 180.00), -- 180ml Susu Segar
-- Caramel Macchiato
(7, 4, 1, 18.00),  -- 18g Biji Kopi
(8, 4, 2, 150.00), -- 150ml Susu Segar
(9, 4, 6, 20.00),  -- 20ml Sirup Karamel Monin
-- Butter Croissant
(10, 5, 5, 1.00);  -- 1 pcs Croissant Dough
