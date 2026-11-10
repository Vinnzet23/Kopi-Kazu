import { produkRepo } from '../repository/produk.js';
export class ProdukController {
    async getAllMenu(req, res, next) {
        try {
            const id_cabang = req.query.id_cabang ? Number(req.query.id_cabang) : 1;
            const menus = await produkRepo.getAllMenu(id_cabang);
            res.json({
                success: true,
                data: menus
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getMenuById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const menu = await produkRepo.getMenuById(id);
            if (!menu) {
                res.status(404).json({
                    success: false,
                    message: 'Menu tidak ditemukan'
                });
                return;
            }
            res.json({
                success: true,
                data: menu
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createMenu(req, res, next) {
        try {
            const { nama_menu, kategori, harga_jual, resep, id_cabang } = req.body;
            if (!nama_menu || !kategori || harga_jual === undefined) {
                res.status(400).json({
                    success: false,
                    message: 'Nama menu, kategori, dan harga jual wajib diisi'
                });
                return;
            }
            const insertId = await produkRepo.createMenu({
                nama_menu,
                kategori,
                harga_jual: Number(harga_jual),
                id_cabang: id_cabang || 1,
                resep: resep || []
            });
            const newMenu = await produkRepo.getMenuById(insertId);
            res.status(201).json({
                success: true,
                message: 'Menu berhasil ditambahkan',
                data: newMenu
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updateMenu(req, res, next) {
        try {
            const id = Number(req.params.id);
            const { nama_menu, kategori, harga_jual, resep } = req.body;
            await produkRepo.updateMenu(id, {
                nama_menu,
                kategori,
                harga_jual: Number(harga_jual),
                resep: resep || []
            });
            const updated = await produkRepo.getMenuById(id);
            res.json({
                success: true,
                message: 'Menu berhasil diperbarui',
                data: updated
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteMenu(req, res, next) {
        try {
            const id = Number(req.params.id);
            await produkRepo.deleteMenu(id);
            res.json({
                success: true,
                message: 'Menu berhasil dihapus'
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getAllBahanBaku(req, res, next) {
        try {
            const id_cabang = req.query.id_cabang ? Number(req.query.id_cabang) : 1;
            const bahan = await produkRepo.getAllBahanBaku(id_cabang);
            res.json({
                success: true,
                data: bahan
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getBahanKritis(req, res, next) {
        try {
            const id_cabang = req.query.id_cabang ? Number(req.query.id_cabang) : 1;
            const bahanKritis = await produkRepo.getBahanKritis(id_cabang);
            res.json({
                success: true,
                data: bahanKritis
            });
        }
        catch (err) {
            next(err);
        }
    }
    async checkout(req, res, next) {
        try {
            const { id_pengguna, metode_bayar, items } = req.body;
            if (!id_pengguna || !metode_bayar || !items || !Array.isArray(items) || items.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Data pesanan, kasir, dan metode pembayaran wajib diisi'
                });
                return;
            }
            const result = await produkRepo.checkoutTransaksi({
                id_pengguna: Number(id_pengguna),
                metode_bayar,
                items
            });
            res.status(201).json({
                success: true,
                message: 'Transaksi checkout berhasil diproses dan stok bahan baku otomatis terpotong',
                data: result
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export const produkController = new ProdukController();
