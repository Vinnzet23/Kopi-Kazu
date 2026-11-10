import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ToastProvider } from './components/Toast.js';
import { LayoutAdmin } from './components/layout/LayoutAdmin.js';
import { HalamanLogin } from './pages/HalamanLogin.js';
import { HalamanRegister } from './pages/HalamanRegister.js';
import { Beranda } from './pages/admin/Beranda.js';
import { HalamanProduk } from './pages/admin/HalamanProduk.js';
import { HalamanPengguna } from './pages/admin/HalamanPengguna.js';
import { HalamanPengaturan } from './pages/admin/HalamanPengaturan.js';
import './App.css';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<HalamanLogin />} />
          <Route path="/register" element={<HalamanRegister />} />

          {/* Admin POS & Backoffice Routes */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Navigate to="/admin/beranda" replace />} />
            <Route path="beranda" element={<Beranda />} />
            <Route path="produk" element={<HalamanProduk />} />
            <Route path="pengguna" element={<HalamanPengguna />} />
            <Route path="pengaturan" element={<HalamanPengaturan />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/admin/beranda" replace />} />
          <Route path="*" element={<Navigate to="/admin/beranda" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;

