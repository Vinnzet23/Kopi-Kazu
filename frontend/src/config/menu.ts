export interface MenuItemConfig {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export const navigationItems: MenuItemConfig[] = [
  { id: 'beranda', label: 'Terminal Kasir', path: '/admin/beranda', icon: 'Store' },
  { id: 'produk', label: 'Daftar Produk', path: '/admin/produk', icon: 'Coffee' },
  { id: 'pengguna', label: 'Kelola Tim / Cabang', path: '/admin/pengguna', icon: 'Users' },
  { id: 'pengaturan', label: 'Pengaturan', path: '/admin/pengaturan', icon: 'Settings' }
];

export const kategoriOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'milk_based', label: 'Milk-Based' },
  { value: 'non_coffee', label: 'Non-Coffee' },
  { value: 'pastry', label: 'Pastry' }
] as const;

