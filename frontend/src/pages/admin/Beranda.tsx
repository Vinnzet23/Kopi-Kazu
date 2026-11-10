import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  Coffee,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { fetchMenu, checkoutPOS } from '../../api/produk.js';
import { mockMenu } from '../../data/produk.js';
import type { MenuWithResep, CartItem, MetodeBayar } from '../../models/produk.js';
import type { Pengguna } from '../../models/akun.js';
import { useToast } from '../../components/Toast.js';

export const Beranda: React.FC = () => {
  const { currentUser } = useOutletContext<{ currentUser: Pengguna | null }>();
  const { showToast } = useToast();

  const [menus, setMenus] = useState<MenuWithResep[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderType, setOrderType] = useState<'dine_in' | 'take_away'>('dine_in');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<MetodeBayar>('qris');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load menu items
  const loadMenuItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMenu(currentUser?.id_cabang || 1);
      if (res.success && res.data) {
        setMenus(res.data);
      } else {
        setMenus(mockMenu);
      }
    } catch {
      setMenus(mockMenu);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id_cabang]);

  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  // Cart operations
  const handleAddToCart = (menu: MenuWithResep) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id_menu === menu.id_menu);
      if (existing) {
        return prev.map((item) =>
          item.id_menu === menu.id_menu
            ? {
                ...item,
                jumlah_porsi: item.jumlah_porsi + 1,
                subtotal: (item.jumlah_porsi + 1) * item.harga_jual
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id_menu: menu.id_menu,
          nama_menu: menu.nama_menu,
          harga_jual: Number(menu.harga_jual),
          jumlah_porsi: 1,
          subtotal: Number(menu.harga_jual),
          kategori: menu.kategori,
          estimasi_porsi: menu.estimasi_porsi
        }
      ];
    });
  };

  const handleUpdateQty = (id_menu: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id_menu === id_menu) {
            const newQty = item.jumlah_porsi + delta;
            return {
              ...item,
              jumlah_porsi: newQty,
              subtotal: newQty * item.harga_jual
            };
          }
          return item;
        })
        .filter((item) => item.jumlah_porsi > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalHarga = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Checkout process with Auto-Deduct
  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Keranjang pesanan masih kosong', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        id_pengguna: currentUser?.id_pengguna || 1,
        metode_bayar: paymentMethod,
        items: cart.map((item) => ({
          id_menu: item.id_menu,
          jumlah_porsi: item.jumlah_porsi,
          subtotal: item.subtotal
        }))
      };

      const res = await checkoutPOS(payload);

      if (res.success && res.data) {
        const trx = res.data;
        showToast(
          `Transaksi ${trx.kode_transaksi} berhasil! Pembayaran Rp ${trx.total_harga.toLocaleString('id-ID')} via ${trx.metode_bayar.toUpperCase()}`,
          'success',
          'Checkout Sukses'
        );

        if (trx.peringatan_stok && trx.peringatan_stok.length > 0) {
          trx.peringatan_stok.forEach((w) => {
            showToast(
              `Stok ${w.nama_bahan} menipis! Sisa ${w.stok_tersisa} ${w.satuan} (Batas minimal: ${w.stok_minimal} ${w.satuan})`,
              'warning',
              '⚠️ Peringatan Stok Kritis'
            );
          });
        }

        setCart([]);
        await loadMenuItems();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memproses transaksi checkout', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMenus = menus.filter((m) => {
    const matchCategory = selectedCategory === 'all' || m.kategori === selectedCategory;
    const matchSearch =
      m.nama_menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pos-container">
      {/* Sisi Kiri: Katalog Menu POS Grid */}
      <section className="pos-catalog-panel">
        <div className="pos-search-bar">
          <div className="search-input-box">
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder="Cari menu kopi, susu, pastry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid var(--warna-border)', borderRadius: 'var(--sudut-kartu)', padding: 4 }}>
            <button
              onClick={() => setOrderType('dine_in')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: orderType === 'dine_in' ? 'var(--warna-utama)' : 'transparent',
                color: orderType === 'dine_in' ? '#ffffff' : 'var(--warna-teks)'
              }}
            >
              Dine In
            </button>
            <button
              onClick={() => setOrderType('take_away')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: orderType === 'take_away' ? 'var(--warna-utama)' : 'transparent',
                color: orderType === 'take_away' ? '#ffffff' : 'var(--warna-teks)'
              }}
            >
              Take Away
            </button>
          </div>

          <button
            onClick={loadMenuItems}
            className="btn btn-outline"
            title="Refresh Menu"
            style={{ padding: '0 12px' }}
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="category-filter-chips">
          {[
            { id: 'all', label: 'Semua Menu' },
            { id: 'espresso', label: 'Espresso' },
            { id: 'milk_based', label: 'Milk-Based' },
            { id: 'non_coffee', label: 'Non-Coffee' },
            { id: 'pastry', label: 'Pastry' }
          ].map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--warna-teks-muat)' }}>
            Memuat katalog menu POS...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--warna-teks-muat)' }}>
            <Coffee size={40} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div>Tidak ada menu yang sesuai dengan filter pencarian.</div>
          </div>
        ) : (
          <div className="pos-grid-menu">
            {filteredMenus.map((menu) => {
              const isStockCritical = menu.status_stok === 'kritis';
              const isStockLow = menu.status_stok === 'menipis';

              return (
                <div key={menu.id_menu} className="menu-card">
                  <div>
                    <div className="menu-card-header">
                      <span className="badge badge-category">
                        {menu.kategori.replace('_', ' ')}
                      </span>
                      {isStockCritical ? (
                        <span className="badge badge-danger">Stok Kritis</span>
                      ) : isStockLow ? (
                        <span className="badge badge-warning">Menipis</span>
                      ) : (
                        <span className="badge badge-success">Aman</span>
                      )}
                    </div>

                    <h3 className="menu-title">{menu.nama_menu}</h3>
                    <div className="menu-price">
                      Rp {Number(menu.harga_jual).toLocaleString('id-ID')}
                    </div>

                    <div className="menu-stock-info">
                      <Coffee size={13} color="var(--warna-teks-muat)" />
                      <span style={{ color: isStockCritical ? 'var(--warna-kritis)' : 'var(--warna-teks)' }}>
                        Estimasi sisa: <strong>{menu.estimasi_porsi ?? 0} porsi</strong>
                      </span>
                    </div>

                    {menu.resep && menu.resep.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--warna-teks-muat)', marginBottom: 12 }}>
                        Resep: {menu.resep.map((r) => `${r.nama_bahan} (${r.takaran}${r.satuan})`).join(', ')}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-add-item"
                    onClick={() => handleAddToCart(menu)}
                    disabled={menu.estimasi_porsi !== undefined && menu.estimasi_porsi <= 0}
                    style={{
                      opacity: menu.estimasi_porsi !== undefined && menu.estimasi_porsi <= 0 ? 0.5 : 1
                    }}
                  >
                    <Plus size={16} />
                    <span>+ Tambah Pesanan</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sisi Kanan: Panel Keranjang Belanja POS & Checkout */}
      <aside className="pos-cart-panel">
        <div className="cart-header">
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--warna-teks-gelap)' }}>
              Keranjang Kasir
            </h2>
            <div style={{ fontSize: 12, color: 'var(--warna-teks-muat)' }}>
              {cart.reduce((sum, i) => sum + i.jumlah_porsi, 0)} item pesanan ({orderType === 'dine_in' ? 'Dine In' : 'Take Away'})
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="btn-outline"
              style={{ padding: '4px 8px', fontSize: 11, color: 'var(--warna-kritis)' }}
              title="Kosongkan Keranjang"
            >
              <Trash2 size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--warna-teks-muat)' }}>
              <Receipt size={40} style={{ opacity: 0.3, marginBottom: 8 }} />
              <div>Belum ada produk dipilih.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Klik tombol '+ Tambah' pada katalog menu.</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id_menu} className="cart-item-row">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.nama_menu}</div>
                  <div className="cart-item-price">
                    Rp {item.harga_jual.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="cart-qty-controls">
                  <button
                    onClick={() => handleUpdateQty(item.id_menu, -1)}
                    className="qty-btn"
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center', fontSize: 13 }}>
                    {item.jumlah_porsi}
                  </span>
                  <button
                    onClick={() => handleUpdateQty(item.id_menu, 1)}
                    className="qty-btn"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <div style={{ minWidth: 80, textAlign: 'right', fontWeight: 700, fontSize: 13, color: 'var(--warna-teks-gelap)' }}>
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Ringkasan Pembayaran */}
        <div className="cart-summary">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warna-teks)', marginBottom: 8 }}>
              Pilih Metode Pembayaran
            </div>
            <div className="payment-method-toggle">
              <button
                className={`payment-opt-btn ${paymentMethod === 'qris' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('qris')}
              >
                <CreditCard size={16} />
                <span>QRIS Instant</span>
              </button>
              <button
                className={`payment-opt-btn ${paymentMethod === 'tunai' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('tunai')}
              >
                <Banknote size={16} />
                <span>Tunai / Cash</span>
              </button>
            </div>
          </div>

          <div className="total-row">
            <span>Total Tagihan:</span>
            <span className="total-amount">
              Rp {totalHarga.toLocaleString('id-ID')}
            </span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--warna-teks-muat)', background: '#F1F5F9', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} color="#1E40AF" />
            <span>Stok bahan baku otomatis terpotong berdasar takaran resep.</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 15 }}
          >
            <span>{isProcessing ? 'Memproses Transaksi...' : 'Bayar & Proses Pesanan'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
