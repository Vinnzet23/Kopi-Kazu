import React, { useState } from 'react';
import { Users, Shield, Plus, Mail, KeyRound } from 'lucide-react';
import { mockPengguna } from '../../data/pengguna.js';
import type { Pengguna } from '../../models/akun.js';
import { useToast } from '../../components/Toast.js';

export const HalamanPengguna: React.FC = () => {
  const { showToast } = useToast();
  const [teamMembers, setTeamMembers] = useState<Pengguna[]>(mockPengguna);
  const [showAddModal, setShowAddModal] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [pinKasir, setPinKasir] = useState('');
  const [peran, setPeran] = useState<'owner' | 'barista'>('barista');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email) return;

    const newMember: Pengguna = {
      id_pengguna: Date.now(),
      nama,
      email,
      pin_kasir: pinKasir || null,
      peran,
      id_cabang: 1,
      nama_cabang: 'Kazu Cafe - Babelan'
    };

    setTeamMembers((prev) => [...prev, newMember]);
    showToast(`Staff baru "${nama}" berhasil didaftarkan!`, 'success');
    setShowAddModal(false);
    setNama('');
    setEmail('');
    setPinKasir('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Users size={24} color="#1E40AF" />
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--warna-teks-gelap)' }}>
              Kelola Tim & Otorisasi Pengguna
            </h1>
          </div>
          <p style={{ color: 'var(--warna-teks)', fontSize: 13 }}>
            Daftar akun Owner dan Barista yang berhak mengakses terminal POS serta manajemen stok.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>+ Tambah Staff / Barista</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Peran / Hak Akses</th>
              <th>Email Akun</th>
              <th>PIN Kasir Cepat</th>
              <th>Penugasan Cabang</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id_pengguna}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="user-avatar" style={{ width: 36, height: 36 }}>
                      {member.nama.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--warna-teks-gelap)' }}>{member.nama}</div>
                      <div style={{ fontSize: 11, color: 'var(--warna-teks-muat)' }}>ID: #{member.id_pengguna}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${member.peran === 'owner' ? 'badge-category' : 'badge-success'}`}>
                    <Shield size={12} />
                    <span style={{ textTransform: 'capitalize' }}>{member.peran}</span>
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} color="#64748B" />
                    <span>{member.email}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <KeyRound size={14} color="#64748B" />
                    <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{member.pin_kasir || '-'}</span>
                  </div>
                </td>
                <td>{member.nama_cabang || 'Kazu Cafe - Babelan'}</td>
                <td>
                  <span className="badge badge-success">Aktif</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" style={{ maxWidth: 460, padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Tambah Pengguna Tim</h2>
              <p style={{ fontSize: 13, color: 'var(--warna-teks)' }}>Tambahkan barista atau manajer operasional kafe.</p>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Barista Rizky"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="rizky@kopikazu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Peran</label>
                <select
                  className="form-select"
                  value={peran}
                  onChange={(e) => setPeran(e.target.value as 'owner' | 'barista')}
                >
                  <option value="barista">Barista (Kasir POS)</option>
                  <option value="owner">Owner (Akses Penuh)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">PIN Cepat (6 Digit)</label>
                <input
                  type="password"
                  maxLength={6}
                  className="form-input"
                  placeholder="123456"
                  value={pinKasir}
                  onChange={(e) => setPinKasir(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
