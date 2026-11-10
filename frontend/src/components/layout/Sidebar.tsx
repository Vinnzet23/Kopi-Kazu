import React from 'react';
import { NavLink } from 'react-router';
import { Store, Coffee, Users, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="admin-sidebar">
      <div style={{ marginBottom: 12, padding: '0 8px', fontSize: 11, fontWeight: 700, color: 'var(--warna-teks-muat)', textTransform: 'uppercase' }}>
        Menu Navigasi
      </div>

      <NavLink
        to="/admin/beranda"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Store size={18} />
        <span>Terminal Kasir</span>
      </NavLink>

      <NavLink
        to="/admin/produk"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Coffee size={18} />
        <span>Katalog & Stok</span>
      </NavLink>

      <NavLink
        to="/admin/pengguna"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Users size={18} />
        <span>Pengguna & Tim</span>
      </NavLink>

      <NavLink
        to="/admin/pengaturan"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        <Settings size={18} />
        <span>Pengaturan Cabang</span>
      </NavLink>

      <div style={{ marginTop: 'auto', padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--warna-border)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warna-teks-gelap)' }}>Auto-Deduct Aktif</div>
        <div style={{ fontSize: 11, color: 'var(--warna-teks)', marginTop: 4 }}>
          Pemotongan stok bahan baku berdasar takaran gram/ml per cup transaksi POS.
        </div>
      </div>
    </aside>
  );
};

