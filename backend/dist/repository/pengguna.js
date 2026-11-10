import { executeQuery } from '../db.js';
export class PenggunaRepository {
    async findByEmail(email) {
        const [rows] = await executeQuery('SELECT * FROM pengguna WHERE email = ? LIMIT 1', [email]);
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    }
    async findByPin(pin) {
        const [rows] = await executeQuery('SELECT * FROM pengguna WHERE pin_kasir = ? LIMIT 1', [pin]);
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    }
    async findById(id) {
        const [rows] = await executeQuery('SELECT * FROM pengguna WHERE id_pengguna = ? LIMIT 1', [id]);
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    }
    async createPengguna(data) {
        const [result] = await executeQuery('INSERT INTO pengguna (nama, email, password, pin_kasir, peran, id_cabang) VALUES (?, ?, ?, ?, ?, ?)', [data.nama, data.email, data.password, data.pin_kasir, data.peran, data.id_cabang]);
        return result.insertId;
    }
    async findCabangById(id_cabang) {
        const [rows] = await executeQuery('SELECT * FROM cabang WHERE id_cabang = ? LIMIT 1', [id_cabang]);
        return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    }
    async createCabang(nama_cabang, alamat) {
        const [result] = await executeQuery('INSERT INTO cabang (nama_cabang, alamat) VALUES (?, ?)', [nama_cabang, alamat || null]);
        return result.insertId;
    }
    async getAllCabang() {
        const [rows] = await executeQuery('SELECT * FROM cabang ORDER BY id_cabang ASC');
        return Array.isArray(rows) ? rows : [];
    }
}
export const penggunaRepo = new PenggunaRepository();
