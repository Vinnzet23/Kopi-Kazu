import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Header } from './Header.js';
import { Sidebar } from './Sidebar.js';
import type { Pengguna } from '../../models/akun.js';
import { mockPengguna } from '../../data/pengguna.js';

export const LayoutAdmin: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Pengguna | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user_kopi_kazu');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        setCurrentUser(mockPengguna[0]);
      }
    } else {
      // Default to demo owner or barista if not logged in
      const defaultUser = mockPengguna[0];
      setCurrentUser(defaultUser);
      localStorage.setItem('user_kopi_kazu', JSON.stringify(defaultUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_kopi_kazu');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <Outlet context={{ currentUser }} />
        </main>
      </div>
    </div>
  );
};

