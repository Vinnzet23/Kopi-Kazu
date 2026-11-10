import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Coffee, Store, MapPin, Bell, LogOut } from 'lucide-react';
import type { Pengguna } from '../../models/akun.js';

interface HeaderProps {
  currentUser?: Pengguna | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('user_kopi_kazu');
      navigate('/login');
    }
  };

  const branchName = currentUser?.nama_cabang || 'Kazu Cafe - Babelan';
  const userName = currentUser?.nama || 'Barista Axel';
  const userRole = currentUser?.peran || 'barista';

  return (
    <header className="admin-header">
      {/* Kiri: Brand & Version Badge */}
      <div className="header-left">
        <NavLink to="/admin/beranda" className="brand-logo">
          <div className="brand-icon-box">
            <Coffee size={20} />
          </div>
          <span>Kopi Kazu</span>
          <span className="version-badge">POS v2.4</span>
        </NavLink>
      </div>

      {/* Tengah: Navigasi Tab */}
      <nav className="header-center">
        <NavLink
          to="/admin/beranda"
          className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
        >
          <Store size={18} />
          <span>Terminal Kasir</span>
        </NavLink>
        <NavLink
          to="/admin/produk"
          className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
        >
          <Coffee size={18} />
          <span>Daftar Produk & Stok</span>
        </NavLink>
      </nav>

      {/* Kanan: Status Online, Pill Cabang, User Profile */}
      <div className="header-right">
        {/* Status Badge */}
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Sistem Online</span>
        </div>

        {/* Pill Cabang */}
        <div className="branch-pill">
          <MapPin size={14} color="#1E40AF" />
          <span>{branchName}</span>
        </div>

        {/* Notifikasi Icon */}
        <button
          className="btn-outline"
          style={{ width: 34, height: 34, padding: 0, borderRadius: '50%' }}
          title="Notifikasi"
        >
          <Bell size={16} />
        </button>

        {/* User Avatar & Profile */}
        <div className="user-profile-badge">
          <div className="user-avatar">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-meta">
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRole}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn-outline"
          style={{ padding: '6px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          title="Keluar"
        >
          <LogOut size={14} />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
};
