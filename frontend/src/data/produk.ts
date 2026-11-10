import type { MenuWithResep, BahanBaku } from '../models/produk.js';

export const mockBahanBaku: BahanBaku[] = [
  { id_bahan: 1, nama_bahan: 'Biji Kopi House Blend', stok_tersisa: 2500.0, satuan: 'gram', stok_minimal: 500.0, id_cabang: 1 },
  { id_bahan: 2, nama_bahan: 'Susu Segar Greenfield', stok_tersisa: 5000.0, satuan: 'ml', stok_minimal: 1000.0, id_cabang: 1 },
  { id_bahan: 3, nama_bahan: 'Sirup Aren Organik', stok_tersisa: 1200.0, satuan: 'ml', stok_minimal: 300.0, id_cabang: 1 },
  { id_bahan: 4, nama_bahan: 'Bubuk Matcha Uji', stok_tersisa: 800.0, satuan: 'gram', stok_minimal: 200.0, id_cabang: 1 },
  { id_bahan: 5, nama_bahan: 'Butter Croissant Dough', stok_tersisa: 15.0, satuan: 'pcs', stok_minimal: 5.0, id_cabang: 1 },
  { id_bahan: 6, nama_bahan: 'Sirup Karamel Monin', stok_tersisa: 250.0, satuan: 'ml', stok_minimal: 300.0, id_cabang: 1 }
];

export const mockMenu: MenuWithResep[] = [
  {
    id_menu: 1,
    nama_menu: 'Kopi Susu Kazu',
    kategori: 'milk_based',
    harga_jual: 22000,
    id_cabang: 1,
    estimasi_porsi: 33,
    status_stok: 'aman',
    resep: [
      { id_resep: 1, id_menu: 1, id_bahan: 1, takaran: 18, nama_bahan: 'Biji Kopi House Blend', satuan: 'gram', stok_tersisa: 2500, stok_minimal: 500 },
      { id_resep: 2, id_menu: 1, id_bahan: 2, takaran: 150, nama_bahan: 'Susu Segar Greenfield', satuan: 'ml', stok_tersisa: 5000, stok_minimal: 1000 },
      { id_resep: 3, id_menu: 1, id_bahan: 3, takaran: 25, nama_bahan: 'Sirup Aren Organik', satuan: 'ml', stok_tersisa: 1200, stok_minimal: 300 }
    ]
  },
  {
    id_menu: 2,
    nama_menu: 'Espresso Single Origin',
    kategori: 'espresso',
    harga_jual: 18000,
    id_cabang: 1,
    estimasi_porsi: 138,
    status_stok: 'aman',
    resep: [
      { id_resep: 4, id_menu: 2, id_bahan: 1, takaran: 18, nama_bahan: 'Biji Kopi House Blend', satuan: 'gram', stok_tersisa: 2500, stok_minimal: 500 }
    ]
  },
  {
    id_menu: 3,
    nama_menu: 'Matcha Latte Ice',
    kategori: 'non_coffee',
    harga_jual: 25000,
    id_cabang: 1,
    estimasi_porsi: 27,
    status_stok: 'aman',
    resep: [
      { id_resep: 5, id_menu: 3, id_bahan: 4, takaran: 20, nama_bahan: 'Bubuk Matcha Uji', satuan: 'gram', stok_tersisa: 800, stok_minimal: 200 },
      { id_resep: 6, id_menu: 3, id_bahan: 2, takaran: 180, nama_bahan: 'Susu Segar Greenfield', satuan: 'ml', stok_tersisa: 5000, stok_minimal: 1000 }
    ]
  },
  {
    id_menu: 4,
    nama_menu: 'Caramel Macchiato',
    kategori: 'milk_based',
    harga_jual: 28000,
    id_cabang: 1,
    estimasi_porsi: 12,
    status_stok: 'kritis',
    resep: [
      { id_resep: 7, id_menu: 4, id_bahan: 1, takaran: 18, nama_bahan: 'Biji Kopi House Blend', satuan: 'gram', stok_tersisa: 2500, stok_minimal: 500 },
      { id_resep: 8, id_menu: 4, id_bahan: 2, takaran: 150, nama_bahan: 'Susu Segar Greenfield', satuan: 'ml', stok_tersisa: 5000, stok_minimal: 1000 },
      { id_resep: 9, id_menu: 4, id_bahan: 6, takaran: 20, nama_bahan: 'Sirup Karamel Monin', satuan: 'ml', stok_tersisa: 250, stok_minimal: 300 }
    ]
  },
  {
    id_menu: 5,
    nama_menu: 'Butter Croissant',
    kategori: 'pastry',
    harga_jual: 24000,
    id_cabang: 1,
    estimasi_porsi: 15,
    status_stok: 'aman',
    resep: [
      { id_resep: 10, id_menu: 5, id_bahan: 5, takaran: 1, nama_bahan: 'Butter Croissant Dough', satuan: 'pcs', stok_tersisa: 15, stok_minimal: 5 }
    ]
  }
];

