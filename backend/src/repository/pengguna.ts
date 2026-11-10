import { executeQuery } from '../db.js';
import type { Pengguna, Cabang } from '../models/pengguna.js';

export class PenggunaRepository {
  async findByEmail(email: string): Promise<Pengguna | null> {
    const [rows] = await executeQuery<Pengguna[]>(
      'SELECT * FROM pengguna WHERE email = ? LIMIT 1',
      [email]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async findByPin(pin: string): Promise<Pengguna | null> {
    const [rows] = await executeQuery<Pengguna[]>(
      'SELECT * FROM pengguna WHERE pin_kasir = ? LIMIT 1',
      [pin]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async findById(id: number): Promise<Pengguna | null> {
    const [rows] = await executeQuery<Pengguna[]>(
      'SELECT * FROM pengguna WHERE id_pengguna = ? LIMIT 1',
      [id]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async createPengguna(data: {
    nama: string;
    email: string;
    password: string;
    pin_kasir: string | null;
    peran: 'owner' | 'barista';
    id_cabang: number;
  }): Promise<number> {
    const [result] = await executeQuery<any>(
      'INSERT INTO pengguna (nama, email, password, pin_kasir, peran, id_cabang) VALUES (?, ?, ?, ?, ?, ?)',
      [data.nama, data.email, data.password, data.pin_kasir, data.peran, data.id_cabang]
    );
    return result.insertId;
  }

  async findCabangById(id_cabang: number): Promise<Cabang | null> {
    const [rows] = await executeQuery<Cabang[]>(
      'SELECT * FROM cabang WHERE id_cabang = ? LIMIT 1',
      [id_cabang]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async createCabang(nama_cabang: string, alamat?: string): Promise<number> {
    const [result] = await executeQuery<any>(
      'INSERT INTO cabang (nama_cabang, alamat) VALUES (?, ?)',
      [nama_cabang, alamat || null]
    );
    return result.insertId;
  }

  async getAllCabang(): Promise<Cabang[]> {
    const [rows] = await executeQuery<Cabang[]>(
      'SELECT * FROM cabang ORDER BY id_cabang ASC'
    );
    return Array.isArray(rows) ? rows : [];
  }
}

export const penggunaRepo = new PenggunaRepository();
