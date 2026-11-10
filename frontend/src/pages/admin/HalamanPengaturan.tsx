import React, { useState } from 'react';
import { Settings, Building, Database, Save, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/Toast.js';

export const HalamanPengaturan: React.FC = () => {
  const { showToast } = useToast();
  const [namaCabang, setNamaCabang] = useState('Kazu Cafe - Babelan');
  const [alamatCabang, setAlamatCabang] = useState('Jl. Babelan Raya No. 42, Babelan, Bekasi');
  const [printerNota, setPrinterNota] = useState('Thermal 58mm POS');
  const [qrisKey, setQrisKey] = useState('QRIS-STATIC-KZ2026');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Konfigurasi pengaturan cabang berhasil diperbarui', 'success');
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--warna-teks-gelap)' }}>
          Pengaturan Cabang & Sistem POS
        </h1>
        <p style={{ color: 'var(--warna-teks)', fontSize: 13, marginTop: 4 }}>
          Konfigurasi profil operasional cabang, terminal kasir, dan integrasi pembayaran.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Kartu Profil Cabang */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Building size={20} color="#1E40AF" />
            <h2 style={{ fontSize: 16 }}>Informasi Cabang Kafe</h2>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nama Cabang</label>
              <input
                type="text"
                className="form-input"
                value={namaCabang}
                onChange={(e) => setNamaCabang(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Operasional</label>
              <textarea
                className="form-input"
                rows={3}
                value={alamatCabang}
                onChange={(e) => setAlamatCabang(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>
              <Save size={16} />
              <span>Simpan Perubahan</span>
            </button>
          </form>
        </div>

        {/* Integrasi Perangkat & Pembayaran */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Settings size={20} color="#964B00" />
            <h2 style={{ fontSize: 16 }}>Perangkat Kasir & QRIS</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Printer Struk Thermal</label>
            <input
              type="text"
              className="form-input"
              value={printerNota}
              onChange={(e) => setPrinterNota(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Merchant ID / QRIS Key</label>
            <input
              type="text"
              className="form-input"
              value={qrisKey}
              onChange={(e) => setQrisKey(e.target.value)}
            />
          </div>

          <div style={{ marginTop: 24, padding: 14, background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--warna-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--warna-teks-gelap)', fontSize: 13 }}>
              <Database size={16} color="#10B981" />
              <span>Database Connection Status</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--warna-teks)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} color="#10B981" />
              <span>ACID Transaction Engine: Ready (MySQL & Fallback Pool)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

