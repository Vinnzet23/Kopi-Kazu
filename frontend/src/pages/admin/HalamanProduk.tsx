import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router';
import {
  Coffee,
  AlertTriangle,
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  fetchMenu,
  fetchBahanBaku,
  fetchBahanKritis,
  createMenu,
  updateMenu,
  deleteMenu
} from '../../api/produk.js';
import { mockMenu, mockBahanBaku } from '../../data/produk.js';
import { FormProduk } from '../../components/FormProduk.js';
import { useToast } from '../../components/Toast.js';
import type { MenuWithResep, BahanBaku, CreateMenuPayload } from '../../models/produk.js';
import type { Pengguna } from '../../models/akun.js';

export const HalamanProduk: React.FC = () => {
  const { currentUser } = useOutletContext<{ currentUser: Pengguna | null }>();
  const { showToast } = useToast();

  const [menus, setMenus] = useState<MenuWithResep[]>([]);
  const [bahanList, setBahanList] = useState<BahanBaku[]>([]);
  const [bahanKritis, setBahanKritis] = useState<BahanBaku[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<MenuWithResep | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const branchId = currentUser?.id_cabang || 1;
    try {
      const [menuRes, bahanRes, kritisRes] = await Promise.all([
        fetchMenu(branchId).catch(() => ({ success: true, data: mockMenu })),
        fetchBahanBaku(branchId).catch(() => ({ success: true, data: mockBahanBaku })),
        fetchBahanKritis(branchId).catch(() => ({
          success: true,
          data: mockBahanBaku.filter((b) => b.stok_tersisa <= b.stok_minimal)
        }))
      ]);

      if (menuRes.data) setMenus(menuRes.data);
      if (bahanRes.data) setBahanList(bahanRes.data);
      if (kritisRes.data) setBahanKritis(kritisRes.data);
    } catch {
      setMenus(mockMenu);
      setBahanList(mockBahanBaku);
      setBahanKritis(mockBahanBaku.filter((b) => b.stok_tersisa <= b.stok_minimal));
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id_cabang]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAddModal = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (menu: MenuWithResep) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
  };

  const handleFormSubmit = async (payload: CreateMenuPayload) => {
    setIsSaving(true);
    try {
      if (editingMenu) {
        await updateMenu(editingMenu.id_menu, payload);
        showToast(`Menu ${payload.nama_menu} berhasil diperbarui`, 'success');
      } else {
        await createMenu(payload);
        showToast(`Menu ${payload.nama_menu} berhasil ditambahkan`, 'success');
      }
      handleCloseModal();
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan menu', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenu = async (id: number, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus menu "${nama}"?`)) return;

    try {
      await deleteMenu(id);
      showToast(`Menu "${nama}" telah dihapus`, 'info');
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus menu', 'danger');
    }
  };

  // KPIs
  const totalMenuAktif = menus.length;
  const totalBahanKritis = bahanKritis.length;
  const totalPorsiTersedia = menus.reduce((acc, m) => acc + (m.estimasi_porsi || 0), 0);

  // Filtered menus
  const filteredMenus = menus.filter((m) => {
    const matchCat = selectedCategory === 'all' || m.kategori === selectedCategory;
    const matchSearch =
      m.nama_menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Top Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--warna-teks-gelap)' }}>
            Daftar Produk & Inventaris Resep
          </h1>
          <p style={{ color: 'var(--warna-teks)', fontSize: 13, marginTop: 4 }}>
            Kelola katalog menu minuman, racikan takaran resep, dan kontrol estimasi ketersediaan stok fisik.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadData} className="btn btn-outline" title="Segarkan Data">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={16} />
            <span>+ Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Widgets */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ background: '#EFF6FF', color: 'var(--warna-utama)' }}>
            <Coffee size={24} />
          </div>
          <div>
            <div className="kpi-value">{totalMenuAktif}</div>
            <div className="kpi-label">Total Menu Aktif</div>
          </div>
        </div>

        <div className="kpi-card" style={{ borderLeft: totalBahanKritis > 0 ? '4px solid var(--warna-kritis)' : undefined }}>
          <div className="kpi-icon-wrapper" style={{ background: 'var(--warna-kritis-bg)', color: 'var(--warna-kritis)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ color: totalBahanKritis > 0 ? 'var(--warna-kritis)' : undefined }}>
              {totalBahanKritis} Bahan
            </div>
            <div className="kpi-label">Peringatan Bahan Menipis/Kritis</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ background: 'var(--warna-sukses-bg)', color: 'var(--warna-sukses)' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="kpi-value">{totalPorsiTersedia} Porsi</div>
            <div className="kpi-label">Total Kapasitas Porsi Terestimasi</div>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {bahanKritis.length > 0 && (
        <div className="alert-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <AlertCircle size={24} color="var(--warna-kritis)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--warna-kritis)', fontSize: 14 }}>
                Restock Warning: Terdapat {bahanKritis.length} Bahan Mentah Mendekati Batas Kritis!
              </div>
              <div style={{ fontSize: 13, color: 'var(--warna-teks)', marginTop: 2 }}>
                {bahanKritis
                  .map((b) => `${b.nama_bahan}: Sisa ${b.stok_tersisa} ${b.satuan} (Min: ${b.stok_minimal} ${b.satuan})`)
                  .join(' • ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Action Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="search-input-box" style={{ maxWidth: 360 }}>
          <Search size={18} color="#94A3B8" />
          <input
            type="text"
            placeholder="Cari nama menu atau SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 160 }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Semua Kategori</option>
          <option value="espresso">Espresso</option>
          <option value="milk_based">Milk-Based</option>
          <option value="non_coffee">Non-Coffee</option>
          <option value="pastry">Pastry</option>
        </select>
      </div>

      {/* Data Table Produk */}
      <div className="table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--warna-teks-muat)' }}>
            Memuat daftar produk...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--warna-teks-muat)' }}>
            Belum ada produk yang cocok dengan pencarian.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Menu & Resep</th>
                <th>Kategori</th>
                <th>Harga Jual</th>
                <th>Komposisi Resep (Auto-Deduct)</th>
                <th>Estimasi Sisa Porsi</th>
                <th>Status Ketersediaan</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenus.map((menu) => {
                const isCritical = menu.status_stok === 'kritis';
                const isWarning = menu.status_stok === 'menipis';

                return (
                  <tr key={menu.id_menu}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--warna-teks-gelap)' }}>
                        {menu.nama_menu}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--warna-teks-muat)' }}>
                        ID: #{menu.id_menu} • Cabang: #{menu.id_cabang}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-category">
                        {menu.kategori.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--warna-utama)', fontFamily: 'var(--font-judul)' }}>
                      Rp {Number(menu.harga_jual).toLocaleString('id-ID')}
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      {menu.resep && menu.resep.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {menu.resep.map((r) => (
                            <div key={r.id_bahan} style={{ fontSize: 12 }}>
                              • {r.nama_bahan}: <strong>{r.takaran} {r.satuan}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--warna-teks-muat)' }}>Tanpa Resep BOM</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: isCritical ? 'var(--warna-kritis)' : 'var(--warna-teks-gelap)' }}>
                          {menu.estimasi_porsi ?? 0} Cup
                        </span>
                      </div>
                    </td>
                    <td>
                      {isCritical ? (
                        <span className="badge badge-danger">Kritis / Habis</span>
                      ) : isWarning ? (
                        <span className="badge badge-warning">Menipis</span>
                      ) : (
                        <span className="badge badge-success">Aman</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleOpenEditModal(menu)}
                          className="btn-outline"
                          style={{ padding: '6px 8px', borderRadius: 6 }}
                          title="Edit Menu & Resep"
                        >
                          <Edit2 size={14} color="#1E40AF" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu.id_menu, menu.nama_menu)}
                          className="btn-outline"
                          style={{ padding: '6px 8px', borderRadius: 6 }}
                          title="Hapus Menu"
                        >
                          <Trash2 size={14} color="#EF4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog FormProduk */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <FormProduk
              initialData={editingMenu}
              bahanList={bahanList}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

