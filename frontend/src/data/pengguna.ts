import type { Pengguna, Cabang } from '../models/akun.js';

export const mockCabang: Cabang[] = [
  {
    id_cabang: 1,
    nama_cabang: 'Kazu Cafe - Babelan',
    alamat: 'Jl. Babelan Raya No. 42, Babelan, Bekasi'
  }
];

export const mockPengguna: Pengguna[] = [
  {
    id_pengguna: 1,
    nama: 'Axel Kazu',
    email: 'owner@kopikazu.com',
    pin_kasir: '123456',
    peran: 'owner',
    id_cabang: 1,
    nama_cabang: 'Kazu Cafe - Babelan'
  },
  {
    id_pengguna: 2,
    nama: 'Barista Axel',
    email: 'barista@kopikazu.com',
    pin_kasir: '654321',
    peran: 'barista',
    id_cabang: 1,
    nama_cabang: 'Kazu Cafe - Babelan'
  }
];

