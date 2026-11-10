// Interface Model Produk, Resep, Bahan Baku, & Transaksi
// Strictly aligned with backend/database/schema.sql

export type KategoriMenu = 'espresso' | 'milk_based' | 'non_coffee' | 'pastry';
export type MetodeBayar = 'tunai' | 'qris';
export type StatusStok = 'aman' | 'menipis' | 'kritis';

export interface BahanBaku {
  id_bahan: number;
  nama_bahan: string;
  stok_tersisa: number;
  satuan: string;
  stok_minimal: number;
  id_cabang: number;
}

export interface Menu {
  id_menu: number;
  nama_menu: string;
  kategori: KategoriMenu;
  harga_jual: number;
  id_cabang: number;
}

export interface Resep {
  id_resep: number;
  id_menu: number;
  id_bahan: number;
  takaran: number;
}

export interface ResepDetail extends Resep {
  nama_bahan?: string;
  satuan?: string;
  stok_tersisa?: number;
  stok_minimal?: number;
}

export interface MenuWithResep extends Menu {
  resep: ResepDetail[];
  estimasi_porsi?: number;
  status_stok?: StatusStok;
  gambar?: string;
}

export interface CreateResepInput {
  id_bahan: number;
  takaran: number;
}

export interface CreateMenuPayload {
  nama_menu: string;
  kategori: KategoriMenu;
  harga_jual: number;
  id_cabang?: number;
  resep?: CreateResepInput[];
}

export interface CartItem {
  id_menu: number;
  nama_menu: string;
  harga_jual: number;
  jumlah_porsi: number;
  subtotal: number;
  kategori: KategoriMenu;
  estimasi_porsi?: number;
}

export interface CheckoutPayload {
  id_pengguna: number;
  metode_bayar: MetodeBayar;
  items: {
    id_menu: number;
    jumlah_porsi: number;
    subtotal: number;
  }[];
}

export interface WarningStok {
  id_bahan: number;
  nama_bahan: string;
  stok_tersisa: number;
  satuan: string;
  stok_minimal: number;
  status: 'menipis' | 'kritis';
}

export interface CheckoutResult {
  id_transaksi: number;
  kode_transaksi: string;
  total_harga: number;
  metode_bayar: MetodeBayar;
  tanggal_transaksi: string;
  peringatan_stok: WarningStok[];
}

