// Interface definition for Cabang & Pengguna
// Strictly aligned with backend/database/schema.sql

export interface Cabang {
  id_cabang: number;
  nama_cabang: string;
  alamat: string | null;
}

export type PeranPengguna = 'owner' | 'barista';

export interface Pengguna {
  id_pengguna: number;
  nama: string;
  email: string;
  password: string;
  pin_kasir: string | null;
  peran: PeranPengguna;
  id_cabang: number;
}

export interface PenggunaResponse {
  id_pengguna: number;
  nama: string;
  email: string;
  pin_kasir: string | null;
  peran: PeranPengguna;
  id_cabang: number;
  nama_cabang?: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  pin_kasir?: string;
}

export interface RegisterPayload {
  nama: string;
  email: string;
  password: string;
  pin_kasir?: string;
  peran?: PeranPengguna;
  nama_cabang?: string;
  alamat_cabang?: string;
  id_cabang?: number;
}

