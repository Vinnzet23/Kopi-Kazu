import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Coffee, User, Mail, Lock, KeyRound, MapPin, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { registerPengguna } from '../api/pengguna.js';
import { useToast } from '../components/Toast.js';

export const HalamanRegister: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pinKasir, setPinKasir] = useState('123456');
  const [namaCabang, setNamaCabang] = useState('');
  const [alamatCabang, setAlamatCabang] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await registerPengguna({
        nama,
        email,
        password,
        pin_kasir: pinKasir,
        peran: 'owner',
        nama_cabang: namaCabang || 'Kazu Cafe Cabang Baru',
        alamat_cabang: alamatCabang
      });

      if (res.success && res.data) {
        localStorage.setItem('user_kopi_kazu', JSON.stringify(res.data));
        showToast('Pendaftaran akun dan cabang kafe berhasil!', 'success');
        navigate('/admin/beranda');
      } else {
        setErrorMessage(res.message || 'Registrasi gagal.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat pendaftaran');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Sisi Kiri: Hero Banner */}
      <div className="auth-hero-pane">
        <div className="auth-hero-content">
          <div className="auth-hero-logo">
            <Coffee size={44} color="#ffffff" />
          </div>
          <h1 className="auth-hero-title">
            Daftarkan Mitra Kafe Anda
          </h1>
          <p className="auth-hero-desc">
            Mulai nikmati kemudahan operasional kedai kopi dengan pemotongan stok bahan baku presisi, Terminal POS responsif, dan dashboard pelaporan real-time.
          </p>

          <div style={{ marginTop: 20, textAlign: 'left', background: 'rgba(255,255,255,0.08)', padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#FFFFFF' }}>Keunggulan Kopi Kazu POS:</div>
            <ul style={{ fontSize: 12, lineHeight: 1.8, paddingLeft: 18, color: '#E2E8F0' }}>
              <li>BOM (Bill of Materials) resep per cup gram & ml</li>
              <li>Peringatan otomatis saat stok mentah menipis</li>
              <li>Multi-cabang & otorisasi multi-role aman</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form Card Register */}
      <div className="auth-form-pane">
        <div className="auth-card" style={{ maxWidth: 480 }}>
          <div className="auth-header">
            <h2 className="auth-title">Daftar Akun Mitra Baru</h2>
            <p className="auth-subtitle">Lengkapi identitas pemilik dan cabang utama kafe Anda</p>
          </div>

          {errorMessage && (
            <div style={{ marginBottom: 16, padding: 12, background: 'var(--warna-kritis-bg)', color: 'var(--warna-kritis)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap Pemilik / Pengelola</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="Contoh: Axel Pratama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
                <User size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Bisnis</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="axel@kafe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Kata Sandi</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">PIN Cepat (6-Digit)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    maxLength={6}
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="123456"
                    value={pinKasir}
                    onChange={(e) => setPinKasir(e.target.value)}
                  />
                  <KeyRound size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Cabang Kafe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="Contoh: Kazu Cafe - Babelan"
                  value={namaCabang}
                  onChange={(e) => setNamaCabang(e.target.value)}
                  required
                />
                <Building size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Lengkap Cabang</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="Jl. Raya Babelan No. 42, Bekasi"
                  value={alamatCabang}
                  onChange={(e) => setAlamatCabang(e.target.value)}
                />
                <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 10 }}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--warna-teks)' }}>
            Sudah memiliki akun?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--warna-utama)' }}>
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

