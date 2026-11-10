import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Layers, AlertCircle, Info } from 'lucide-react';
import type { BahanBaku, MenuWithResep, CreateMenuPayload, KategoriMenu } from '../models/produk.js';

interface FormProdukProps {
  initialData?: MenuWithResep | null;
  bahanList: BahanBaku[];
  onSubmit: (data: CreateMenuPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface RecipeInputRow {
  id_bahan: number;
  takaran: number;
}

export const FormProduk: React.FC<FormProdukProps> = ({
  initialData,
  bahanList,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [namaMenu, setNamaMenu] = useState('');
  const [kategori, setKategori] = useState<KategoriMenu>('milk_based');
  const [hargaJual, setHargaJual] = useState<number>(20000);
  const [resepRows, setResepRows] = useState<RecipeInputRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNamaMenu(initialData.nama_menu);
      setKategori(initialData.kategori);
      setHargaJual(Number(initialData.harga_jual));
      if (initialData.resep && initialData.resep.length > 0) {
        setResepRows(
          initialData.resep.map((r) => ({
            id_bahan: r.id_bahan,
            takaran: Number(r.takaran)
          }))
        );
      } else {
        setResepRows([{ id_bahan: bahanList[0]?.id_bahan || 1, takaran: 15 }]);
      }
    } else {
      setNamaMenu('');
      setKategori('milk_based');
      setHargaJual(22000);
      setResepRows(
        bahanList.length > 0
          ? [
              { id_bahan: bahanList[0].id_bahan, takaran: 18 },
              { id_bahan: bahanList[1]?.id_bahan || bahanList[0].id_bahan, takaran: 150 }
            ]
          : []
      );
    }
  }, [initialData, bahanList]);

  const handleAddRecipeRow = () => {
    const defaultBahan = bahanList[0]?.id_bahan || 1;
    setResepRows((prev) => [...prev, { id_bahan: defaultBahan, takaran: 10 }]);
  };

  const handleRemoveRecipeRow = (index: number) => {
    setResepRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: keyof RecipeInputRow, value: any) => {
    setResepRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const getBahanInfo = (idBahan: number) => {
    return bahanList.find((b) => b.id_bahan === idBahan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!namaMenu.trim()) {
      setErrorMsg('Nama menu wajib diisi.');
      return;
    }

    if (hargaJual <= 0) {
      setErrorMsg('Harga jual harus lebih besar dari 0.');
      return;
    }

    // Filter valid recipe rows
    const validResep = resepRows
      .filter((r) => r.id_bahan && r.takaran > 0)
      .map((r) => ({
        id_bahan: Number(r.id_bahan),
        takaran: Number(r.takaran)
      }));

    const payload: CreateMenuPayload = {
      nama_menu: namaMenu.trim(),
      kategori,
      harga_jual: Number(hargaJual),
      id_cabang: 1,
      resep: validResep
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan menu');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--warna-border)' }}>
        <h2 style={{ fontSize: 18, color: 'var(--warna-teks-gelap)' }}>
          {initialData ? 'Edit Menu & Komposisi Resep' : 'Tambah Menu Baru & Atur Resep'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--warna-teks)', marginTop: 4 }}>
          Konfigurasi data menu serta takaran bahan mentah untuk sistem pemotongan stok otomatis.
        </p>
      </div>

      {errorMsg && (
        <div style={{ margin: '16px 24px', padding: 12, background: 'var(--warna-kritis-bg)', color: 'var(--warna-kritis)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="form-produk-container">
        {/* Kolom Kiri: Informasi Dasar Produk */}
        <div>
          <div className="form-section-title">
            <Layers size={18} color="#1E40AF" />
            <span>Informasi Produk</span>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Menu / Produk</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Kopi Susu Aren Spesial"
              value={namaMenu}
              onChange={(e) => setNamaMenu(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              className="form-select"
              value={kategori}
              onChange={(e) => setKategori(e.target.value as KategoriMenu)}
            >
              <option value="espresso">Espresso</option>
              <option value="milk_based">Milk-Based</option>
              <option value="non_coffee">Non-Coffee</option>
              <option value="pastry">Pastry</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Harga Jual (Rp)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              step="500"
              placeholder="22000"
              value={hargaJual}
              onChange={(e) => setHargaJual(Number(e.target.value))}
              required
            />
          </div>

          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid var(--warna-border)', marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warna-teks-gelap)', marginBottom: 4 }}>
              Catatan Manajemen Stok
            </div>
            <div style={{ fontSize: 12, color: 'var(--warna-teks)' }}>
              Setiap kali menu ini terjual di Terminal Kasir POS, stok fisik dari setiap bahan baku di sebelah kanan akan terpotong secara otomatis sesuai takaran per cup.
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Komposisi Resep Dinamis & Auto-Deduct */}
        <div>
          <div className="form-section-title">
            <Info size={18} color="#964B00" />
            <span>Komposisi Resep & Auto-Deduct</span>
          </div>

          <div className="recipe-banner">
            <span>⚡ <strong>Recipe-Based Auto-Deduct:</strong> Stok bahan baku otomatis terpotong saat transaksi berhasil.</span>
          </div>

          <table className="recipe-rows-table">
            <thead>
              <tr>
                <th>Pilih Bahan Mentah</th>
                <th style={{ width: 120 }}>Takaran per Porsi</th>
                <th style={{ width: 60 }}>Satuan</th>
                <th style={{ width: 40 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {resepRows.map((row, idx) => {
                const infoBahan = getBahanInfo(row.id_bahan);
                return (
                  <tr key={idx}>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: 13 }}
                        value={row.id_bahan}
                        onChange={(e) => handleUpdateRow(idx, 'id_bahan', Number(e.target.value))}
                      >
                        {bahanList.map((b) => (
                          <option key={b.id_bahan} value={b.id_bahan}>
                            {b.nama_bahan} (Stok: {b.stok_tersisa} {b.satuan})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: 13 }}
                        min="0.1"
                        step="0.5"
                        value={row.takaran}
                        onChange={(e) => handleUpdateRow(idx, 'takaran', Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <span className="badge badge-category" style={{ fontSize: 11 }}>
                        {infoBahan?.satuan || 'gram'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipeRow(idx)}
                        className="remove-row-btn"
                        title="Hapus baris resep"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {resepRows.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--warna-teks-muat)', padding: 16 }}>
                    Belum ada bahan baku dikaitkan. Klik tombol di bawah untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            type="button"
            onClick={handleAddRecipeRow}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: 13, padding: '8px 12px' }}
          >
            <Plus size={16} />
            <span>+ Tambah Bahan Resep Lainnya</span>
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="form-footer-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isLoading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Produk & Aktifkan'}
        </button>
      </div>
    </form>
  );
};

