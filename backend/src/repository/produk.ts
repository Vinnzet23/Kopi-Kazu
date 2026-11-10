import { executeQuery, beginDBTransaction } from '../db.js';
import type {
  Menu,
  BahanBaku,
  ResepDetail,
  MenuWithResep,
  CreateMenuPayload,
  CheckoutPayload,
  CheckoutResult,
  WarningStok,
  StatusStok
} from '../models/produk.js';

export class ProdukRepository {
  async getAllMenu(id_cabang: number = 1): Promise<MenuWithResep[]> {
    const [menus] = await executeQuery<Menu[]>(
      'SELECT * FROM menu WHERE id_cabang = ? ORDER BY id_menu DESC',
      [id_cabang]
    );

    const result: MenuWithResep[] = [];

    for (const m of menus) {
      const [resepRows] = await executeQuery<ResepDetail[]>(
        `SELECT r.id_resep, r.id_menu, r.id_bahan, r.takaran,
                b.nama_bahan, b.satuan, b.stok_tersisa, b.stok_minimal
         FROM resep r
         JOIN bahan_baku b ON r.id_bahan = b.id_bahan
         WHERE r.id_menu = ?`,
        [m.id_menu]
      );

      let estimasiPorsi = 999;
      let statusStok: StatusStok = 'aman';

      if (resepRows.length === 0) {
        estimasiPorsi = 50;
      } else {
        for (const r of resepRows) {
          if (r.takaran > 0) {
            const porsiBahan = Math.floor(Number(r.stok_tersisa || 0) / Number(r.takaran));
            if (porsiBahan < estimasiPorsi) {
              estimasiPorsi = porsiBahan;
            }
          }
          if (Number(r.stok_tersisa || 0) <= Number(r.stok_minimal || 0)) {
            statusStok = 'kritis';
          } else if (Number(r.stok_tersisa || 0) <= Number(r.stok_minimal || 0) * 1.5) {
            if (statusStok !== 'kritis') statusStok = 'menipis';
          }
        }
      }

      if (estimasiPorsi <= 0) {
        statusStok = 'kritis';
      } else if (estimasiPorsi <= 10 && statusStok !== 'kritis') {
        statusStok = 'menipis';
      }

      result.push({
        ...m,
        resep: resepRows,
        estimasi_porsi: estimasiPorsi === 999 ? 0 : estimasiPorsi,
        status_stok: statusStok
      });
    }

    return result;
  }

  async getMenuById(id_menu: number): Promise<MenuWithResep | null> {
    const [rows] = await executeQuery<Menu[]>(
      'SELECT * FROM menu WHERE id_menu = ? LIMIT 1',
      [id_menu]
    );
    if (!rows || rows.length === 0) return null;

    const m = rows[0];
    const [resepRows] = await executeQuery<ResepDetail[]>(
      `SELECT r.id_resep, r.id_menu, r.id_bahan, r.takaran,
              b.nama_bahan, b.satuan, b.stok_tersisa, b.stok_minimal
       FROM resep r
       JOIN bahan_baku b ON r.id_bahan = b.id_bahan
       WHERE r.id_menu = ?`,
      [m.id_menu]
    );

    return {
      ...m,
      resep: resepRows
    };
  }

  async createMenu(data: CreateMenuPayload): Promise<number> {
    const id_cabang = data.id_cabang || 1;
    const [result] = await executeQuery<any>(
      'INSERT INTO menu (nama_menu, kategori, harga_jual, id_cabang) VALUES (?, ?, ?, ?)',
      [data.nama_menu, data.kategori, data.harga_jual, id_cabang]
    );
    const newMenuId = result.insertId;

    if (data.resep && Array.isArray(data.resep) && data.resep.length > 0) {
      for (const item of data.resep) {
        if (item.id_bahan && item.takaran > 0) {
          await executeQuery(
            'INSERT INTO resep (id_menu, id_bahan, takaran) VALUES (?, ?, ?)',
            [newMenuId, item.id_bahan, item.takaran]
          );
        }
      }
    }

    return newMenuId;
  }

  async updateMenu(id_menu: number, data: CreateMenuPayload): Promise<void> {
    await executeQuery(
      'UPDATE menu SET nama_menu = ?, kategori = ?, harga_jual = ? WHERE id_menu = ?',
      [data.nama_menu, data.kategori, data.harga_jual, id_menu]
    );

    await executeQuery('DELETE FROM resep WHERE id_menu = ?', [id_menu]);
    if (data.resep && Array.isArray(data.resep) && data.resep.length > 0) {
      for (const item of data.resep) {
        if (item.id_bahan && item.takaran > 0) {
          await executeQuery(
            'INSERT INTO resep (id_menu, id_bahan, takaran) VALUES (?, ?, ?)',
            [id_menu, item.id_bahan, item.takaran]
          );
        }
      }
    }
  }

  async deleteMenu(id_menu: number): Promise<void> {
    await executeQuery('DELETE FROM resep WHERE id_menu = ?', [id_menu]);
    await executeQuery('DELETE FROM menu WHERE id_menu = ?', [id_menu]);
  }

  async getAllBahanBaku(id_cabang: number = 1): Promise<BahanBaku[]> {
    const [rows] = await executeQuery<BahanBaku[]>(
      'SELECT * FROM bahan_baku WHERE id_cabang = ? ORDER BY id_bahan ASC',
      [id_cabang]
    );
    return Array.isArray(rows) ? rows : [];
  }

  async getBahanKritis(id_cabang: number = 1): Promise<BahanBaku[]> {
    const [rows] = await executeQuery<BahanBaku[]>(
      'SELECT * FROM bahan_baku WHERE id_cabang = ? AND stok_tersisa <= stok_minimal',
      [id_cabang]
    );
    return Array.isArray(rows) ? rows : [];
  }

  async checkoutTransaksi(payload: CheckoutPayload): Promise<CheckoutResult> {
    const tx = await beginDBTransaction();

    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const kodeTransaksi = `TRX-${dateStr}-${randomSuffix}`;

      const totalHarga = payload.items.reduce((acc, item) => acc + Number(item.subtotal), 0);

      const trxResult = await tx.query(
        'INSERT INTO transaksi (kode_transaksi, id_pengguna, total_harga, metode_bayar) VALUES (?, ?, ?, ?)',
        [kodeTransaksi, payload.id_pengguna, totalHarga, payload.metode_bayar]
      );
      const idTransaksi = trxResult.insertId;

      for (const item of payload.items) {
        await tx.query(
          'INSERT INTO detail_transaksi (id_transaksi, id_menu, jumlah_porsi, subtotal) VALUES (?, ?, ?, ?)',
          [idTransaksi, item.id_menu, item.jumlah_porsi, item.subtotal]
        );

        await tx.query(
          'UPDATE bahan_baku b JOIN resep r ON b.id_bahan = r.id_bahan SET b.stok_tersisa = b.stok_tersisa - (r.takaran * ?) WHERE r.id_menu = ?',
          [item.jumlah_porsi, item.id_menu]
        );
      }

      const lowStockRows = await tx.query(
        'SELECT id_bahan, nama_bahan, stok_tersisa, satuan, stok_minimal FROM bahan_baku WHERE stok_tersisa <= stok_minimal'
      );

      const warnings: WarningStok[] = Array.isArray(lowStockRows)
        ? lowStockRows.map((row: any) => ({
            id_bahan: row.id_bahan,
            nama_bahan: row.nama_bahan,
            stok_tersisa: Number(row.stok_tersisa),
            satuan: row.satuan,
            stok_minimal: Number(row.stok_minimal),
            status: Number(row.stok_tersisa) <= 0 ? 'kritis' : 'menipis'
          }))
        : [];

      await tx.commit();
      tx.release();

      return {
        id_transaksi: idTransaksi,
        kode_transaksi: kodeTransaksi,
        total_harga: totalHarga,
        metode_bayar: payload.metode_bayar,
        tanggal_transaksi: now.toISOString(),
        peringatan_stok: warnings
      };
    } catch (error) {
      await tx.rollback();
      tx.release();
      throw error;
    }
  }
}

export const produkRepo = new ProdukRepository();
