import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Coffee, KeyRound, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { loginPengguna } from '../api/pengguna.js';
import { useToast } from '../components/Toast.js';

export const HalamanLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loginMode, setLoginMode] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('owner@kopikazu.com');
  const [password, setPassword] = useState('password123');
  const [pinKasir, setPinKasir] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const payload = loginMode === 'pin' ? { pin_kasir: pinKasir } : { email, password };
      const res = await loginPengguna(payload);

      if (res.success && res.data) {
        localStorage.setItem('user_kopi_kazu', JSON.stringify(res.data));
        showToast(`Selamat datang kembali, ${res.data.nama}!`, 'success');
        navigate('/admin/beranda');
      } else {
        setErrorMessage(res.message || 'Login gagal.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (type: 'owner' | 'barista') => {
    if (type === 'owner') {
      setLoginMode('email');
      setEmail('owner@kopikazu.com');
      setPassword('password123');
    } else {
      setLoginMode('pin');
      setPinKasir('654321');
    }
  };

  return (
    <div className="auth-page-container">
      {/* Sisi Kiri: Hero & Brand Slogan */}
      <div className="auth-hero-pane">
        <div className="auth-hero-content">
          <div className="auth-hero-logo">
            <Coffee size={44} color="#ffffff" />
          </div>
          <h1 className="auth-hero-title">
            Kelola Kafe Jadi Lebih Santai
          </h1>
          <p className="auth-hero-desc">
            Sistem Point of Sale (POS) dan pelacakan stok bahan baku otomatis berbasis resep (*recipe-based auto-deduction*). Dirancang khusus untuk efisiensi kedai kopi modern.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 8, fontSize: 12 }}>
              ✨ Auto-Deduct Inventory
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 8, fontSize: 12 }}>
              ⚡ Real-time Alerts
            </div>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form Card Login */}
      <div className="auth-form-pane">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Masuk ke Kopi Kazu</h2>
            <p className="auth-subtitle">Pilih metode masuk kasir atau akun pemilik kafe</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${loginMode === 'email' ? 'active' : ''}`}
              onClick={() => setLoginMode('email')}
            >
              Email & Kata Sandi
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${loginMode === 'pin' ? 'active' : ''}`}
              onClick={() => setLoginMode('pin')}
            >
              PIN Cepat Kasir
            </button>
          </div>

          {errorMessage && (
            <div style={{ marginBottom: 16, padding: 12, background: 'var(--warna-kritis-bg)', color: 'var(--warna-kritis)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {loginMode === 'email' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Alamat Email Bisnis</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: 38 }}
                      placeholder="owner@kopikazu.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
                  </div>
                </div>

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
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">6-Digit PIN Kasir</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    maxLength={6}
                    className="form-input"
                    style={{ paddingLeft: 38, letterSpacing: '4px', fontSize: 18 }}
                    placeholder="123456"
                    value={pinKasir}
                    onChange={(e) => setPinKasir(e.target.value)}
                    required
                  />
                  <KeyRound size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 14 }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--warna-teks-muat)' }}>
                  Gunakan PIN 6 digit yang telah didaftarkan oleh manajer kafe.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Memproses...' : 'Masuk ke Aplikasi'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Fill Credentials Demo Helper */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--warna-border)', fontSize: 12, color: 'var(--warna-teks-muat)' }}>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Demo Login Cepat:</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleQuickFill('owner')}
                className="btn btn-outline"
                style={{ flex: 1, padding: '6px 8px', fontSize: 11 }}
              >
                Owner (Email)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('barista')}
                className="btn btn-outline"
                style={{ flex: 1, padding: '6px 8px', fontSize: 11 }}
              >
                Barista (PIN 654321)
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--warna-teks)' }}>
            Belum punya akun mitra?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--warna-utama)' }}>
              Daftar Cabang Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

