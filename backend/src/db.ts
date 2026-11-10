import mysql from 'mysql2/promise';
import type { Pool, PoolConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let pool: Pool | null = null;
let isConnected = false;

// In-Memory Database Store for Fallback / Standalone mode
interface MockDB {
  cabang: any[];
  pengguna: any[];
  bahan_baku: any[];
  menu: any[];
  resep: any[];
  transaksi: any[];
  detail_transaksi: any[];
}

export const memoryStore: MockDB = {
  cabang: [
    { id_cabang: 1, nama_cabang: 'Kazu Cafe - Babelan', alamat: 'Jl. Babelan Raya No. 42, Babelan, Bekasi' }
  ],
  pengguna: [
    {
      id_pengguna: 1,
      nama: 'Axel Kazu',
      email: 'owner@kopikazu.com',
      password: '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', // password123
      pin_kasir: '123456',
      peran: 'owner',
      id_cabang: 1
    },
    {
      id_pengguna: 2,
      nama: 'Barista Axel',
      email: 'barista@kopikazu.com',
      password: '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', // barista123
      pin_kasir: '654321',
      peran: 'barista',
      id_cabang: 1
    }
  ],
  bahan_baku: [
    { id_bahan: 1, nama_bahan: 'Biji Kopi House Blend', stok_tersisa: 2500.0, satuan: 'gram', stok_minimal: 500.0, id_cabang: 1 },
    { id_bahan: 2, nama_bahan: 'Susu Segar Greenfield', stok_tersisa: 5000.0, satuan: 'ml', stok_minimal: 1000.0, id_cabang: 1 },
    { id_bahan: 3, nama_bahan: 'Sirup Aren Organik', stok_tersisa: 1200.0, satuan: 'ml', stok_minimal: 300.0, id_cabang: 1 },
    { id_bahan: 4, nama_bahan: 'Bubuk Matcha Uji', stok_tersisa: 800.0, satuan: 'gram', stok_minimal: 200.0, id_cabang: 1 },
    { id_bahan: 5, nama_bahan: 'Butter Croissant Dough', stok_tersisa: 15.0, satuan: 'pcs', stok_minimal: 5.0, id_cabang: 1 },
    { id_bahan: 6, nama_bahan: 'Sirup Karamel Monin', stok_tersisa: 250.0, satuan: 'ml', stok_minimal: 300.0, id_cabang: 1 }
  ],
  menu: [
    { id_menu: 1, nama_menu: 'Kopi Susu Kazu', kategori: 'milk_based', harga_jual: 22000.0, id_cabang: 1 },
    { id_menu: 2, nama_menu: 'Espresso Single Origin', kategori: 'espresso', harga_jual: 18000.0, id_cabang: 1 },
    { id_menu: 3, nama_menu: 'Matcha Latte Ice', kategori: 'non_coffee', harga_jual: 25000.0, id_cabang: 1 },
    { id_menu: 4, nama_menu: 'Caramel Macchiato', kategori: 'milk_based', harga_jual: 28000.0, id_cabang: 1 },
    { id_menu: 5, nama_menu: 'Butter Croissant', kategori: 'pastry', harga_jual: 24000.0, id_cabang: 1 }
  ],
  resep: [
    { id_resep: 1, id_menu: 1, id_bahan: 1, takaran: 18.0 },
    { id_resep: 2, id_menu: 1, id_bahan: 2, takaran: 150.0 },
    { id_resep: 3, id_menu: 1, id_bahan: 3, takaran: 25.0 },
    { id_resep: 4, id_menu: 2, id_bahan: 1, takaran: 18.0 },
    { id_resep: 5, id_menu: 3, id_bahan: 4, takaran: 20.0 },
    { id_resep: 6, id_menu: 3, id_bahan: 2, takaran: 180.0 },
    { id_resep: 7, id_menu: 4, id_bahan: 1, takaran: 18.0 },
    { id_resep: 8, id_menu: 4, id_bahan: 2, takaran: 150.0 },
    { id_resep: 9, id_menu: 4, id_bahan: 6, takaran: 20.0 },
    { id_resep: 10, id_menu: 5, id_bahan: 5, takaran: 1.0 }
  ],
  transaksi: [],
  detail_transaksi: []
};

// Automatic Table Creation and Seeding
async function autoMigrateDatabase(conn: PoolConnection) {
  try {
    // 1. Cabang
    await conn.query(`
      CREATE TABLE IF NOT EXISTS cabang (
        id_cabang INT AUTO_INCREMENT PRIMARY KEY,
        nama_cabang VARCHAR(100) NOT NULL,
        alamat TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Pengguna
    await conn.query(`
      CREATE TABLE IF NOT EXISTS pengguna (
        id_pengguna INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        pin_kasir VARCHAR(6) NULL,
        peran ENUM('owner', 'barista') DEFAULT 'barista',
        id_cabang INT NOT NULL,
        FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Bahan Baku
    await conn.query(`
      CREATE TABLE IF NOT EXISTS bahan_baku (
        id_bahan INT AUTO_INCREMENT PRIMARY KEY,
        nama_bahan VARCHAR(100) NOT NULL,
        stok_tersisa DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        satuan VARCHAR(20) NOT NULL,
        stok_minimal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        id_cabang INT NOT NULL,
        FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Menu
    await conn.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id_menu INT AUTO_INCREMENT PRIMARY KEY,
        nama_menu VARCHAR(100) NOT NULL,
        kategori ENUM('espresso', 'milk_based', 'non_coffee', 'pastry') NOT NULL,
        harga_jual DECIMAL(10,2) NOT NULL,
        id_cabang INT NOT NULL,
        FOREIGN KEY (id_cabang) REFERENCES cabang(id_cabang) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Resep
    await conn.query(`
      CREATE TABLE IF NOT EXISTS resep (
        id_resep INT AUTO_INCREMENT PRIMARY KEY,
        id_menu INT NOT NULL,
        id_bahan INT NOT NULL,
        takaran DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (id_menu) REFERENCES menu(id_menu) ON DELETE CASCADE,
        FOREIGN KEY (id_bahan) REFERENCES bahan_baku(id_bahan) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Transaksi
    await conn.query(`
      CREATE TABLE IF NOT EXISTS transaksi (
        id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
        kode_transaksi VARCHAR(50) NOT NULL UNIQUE,
        id_pengguna INT NOT NULL,
        total_harga DECIMAL(10,2) NOT NULL,
        metode_bayar ENUM('tunai', 'qris') NOT NULL,
        tanggal_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_pengguna) REFERENCES pengguna(id_pengguna)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Detail Transaksi
    await conn.query(`
      CREATE TABLE IF NOT EXISTS detail_transaksi (
        id_detail INT AUTO_INCREMENT PRIMARY KEY,
        id_transaksi INT NOT NULL,
        id_menu INT NOT NULL,
        jumlah_porsi INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (id_transaksi) REFERENCES transaksi(id_transaksi) ON DELETE CASCADE,
        FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if initial seeding is needed
    const [cabangRows]: any = await conn.query('SELECT COUNT(*) as cnt FROM cabang');
    if (cabangRows[0]?.cnt === 0) {
      await conn.query(`
        INSERT INTO cabang (id_cabang, nama_cabang, alamat) VALUES
        (1, 'Kazu Cafe - Babelan', 'Jl. Babelan Raya No. 42, Babelan, Bekasi');
      `);

      await conn.query(`
        INSERT INTO pengguna (id_pengguna, nama, email, password, pin_kasir, peran, id_cabang) VALUES
        (1, 'Axel Kazu', 'owner@kopikazu.com', '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', '123456', 'owner', 1),
        (2, 'Barista Axel', 'barista@kopikazu.com', '$2a$10$7ZzWkUqXl3pGZ.x5F/qj8e8g8Vv8oQ8f4W9u2X0q7Z7zWkUqXl3pG', '654321', 'barista', 1);
      `);

      await conn.query(`
        INSERT INTO bahan_baku (id_bahan, nama_bahan, stok_tersisa, satuan, stok_minimal, id_cabang) VALUES
        (1, 'Biji Kopi House Blend', 2500.00, 'gram', 500.00, 1),
        (2, 'Susu Segar Greenfield', 5000.00, 'ml', 1000.00, 1),
        (3, 'Sirup Aren Organik', 1200.00, 'ml', 300.00, 1),
        (4, 'Bubuk Matcha Uji', 800.00, 'gram', 200.00, 1),
        (5, 'Butter Croissant Dough', 15.00, 'pcs', 5.00, 1),
        (6, 'Sirup Karamel Monin', 250.00, 'ml', 300.00, 1);
      `);

      await conn.query(`
        INSERT INTO menu (id_menu, nama_menu, kategori, harga_jual, id_cabang) VALUES
        (1, 'Kopi Susu Kazu', 'milk_based', 22000.00, 1),
        (2, 'Espresso Single Origin', 'espresso', 18000.00, 1),
        (3, 'Matcha Latte Ice', 'non_coffee', 25000.00, 1),
        (4, 'Caramel Macchiato', 'milk_based', 28000.00, 1),
        (5, 'Butter Croissant', 'pastry', 24000.00, 1);
      `);

      await conn.query(`
        INSERT INTO resep (id_resep, id_menu, id_bahan, takaran) VALUES
        (1, 1, 1, 18.00),
        (2, 1, 2, 150.00),
        (3, 1, 3, 25.00),
        (4, 2, 1, 18.00),
        (5, 3, 4, 20.00),
        (6, 3, 2, 180.00),
        (7, 4, 1, 18.00),
        (8, 4, 2, 150.00),
        (9, 4, 6, 20.00),
        (10, 5, 5, 1.00);
      `);
      console.log('🌱 Database seeded successfully with initial data!');
    } else {
      console.log('✅ Tables verified in database.');
    }
  } catch (err: any) {
    console.error('⚠️  Auto-migration notice:', err.message);
  }
}

try {
  const targetDb = process.env.DB_NAME || 'kasirku';
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: targetDb,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 2000
  });

  pool.getConnection()
    .then(async (conn) => {
      isConnected = true;
      console.log('✅ Connected to MySQL database:', targetDb);
      await autoMigrateDatabase(conn);
      conn.release();
    })
    .catch((err) => {
      isConnected = false;
      console.warn('⚠️  MySQL not reachable (running in fallback in-memory mode):', err.message);
    });
} catch (err: any) {
  isConnected = false;
  console.warn('⚠️  Could not initialize MySQL pool (running in fallback mode):', err.message);
}

export const getDB = () => pool;
export const isDatabaseConnected = () => isConnected;

export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<[T, any]> {
  if (isConnected && pool) {
    try {
      return (await pool.query(sql, params)) as [T, any];
    } catch (err: any) {
      console.error('MySQL query error, attempting fallback:', err.message);
      // If table doesn't exist error in MySQL, attempt autoMigrate and retry once
      if (err.code === 'ER_NO_SUCH_TABLE') {
        try {
          const conn = await pool.getConnection();
          await autoMigrateDatabase(conn);
          conn.release();
          return (await pool.query(sql, params)) as [T, any];
        } catch {
          // If still fails, fallback to simulator
        }
      }
    }
  }

  return [simulateQuery(sql, params) as T, null];
}

export interface DBTransaction {
  query: (sql: string, params?: any[]) => Promise<any>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
}

export async function beginDBTransaction(): Promise<DBTransaction> {
  if (isConnected && pool) {
    try {
      const conn: PoolConnection = await pool.getConnection();
      
      // Auto-check if table transaksi exists before transaction
      try {
        await conn.query('SELECT 1 FROM transaksi LIMIT 1');
      } catch (err: any) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.log('⚡ Table missing, running auto-migration on database...');
          await autoMigrateDatabase(conn);
        }
      }

      await conn.beginTransaction();
      return {
        query: async (sql: string, params: any[] = []) => {
          const [result] = await conn.query(sql, params);
          return result;
        },
        commit: async () => {
          await conn.commit();
        },
        rollback: async () => {
          await conn.rollback();
        },
        release: () => {
          conn.release();
        }
      };
    } catch (err: any) {
      console.warn('Could not start MySQL transaction, falling back to memory transaction:', err.message);
    }
  }

  const snapshot = JSON.parse(JSON.stringify(memoryStore));
  return {
    query: async (sql: string, params: any[] = []) => {
      return simulateQuery(sql, params);
    },
    commit: async () => {
      // Changes already in memoryStore
    },
    rollback: async () => {
      Object.assign(memoryStore, snapshot);
    },
    release: () => {
      // No-op
    }
  };
}

function simulateQuery(sql: string, params: any[] = []): any {
  const normalized = sql.replace(/\s+/g, ' ').trim().toLowerCase();

  if (normalized.startsWith('select') && normalized.includes('from cabang')) {
    if (params.length > 0) {
      return memoryStore.cabang.filter(c => c.id_cabang === params[0]);
    }
    return [...memoryStore.cabang];
  }

  if (normalized.startsWith('select') && normalized.includes('from pengguna')) {
    if (normalized.includes('where email =')) {
      return memoryStore.pengguna.filter(p => p.email.toLowerCase() === String(params[0]).toLowerCase());
    }
    if (normalized.includes('where pin_kasir =')) {
      return memoryStore.pengguna.filter(p => p.pin_kasir === String(params[0]));
    }
    if (normalized.includes('where id_pengguna =')) {
      return memoryStore.pengguna.filter(p => p.id_pengguna === Number(params[0]));
    }
    return [...memoryStore.pengguna];
  }

  if (normalized.startsWith('insert into pengguna')) {
    const newId = memoryStore.pengguna.length > 0 ? Math.max(...memoryStore.pengguna.map(p => p.id_pengguna)) + 1 : 1;
    const newPengguna = {
      id_pengguna: newId,
      nama: params[0],
      email: params[1],
      password: params[2],
      pin_kasir: params[3] || null,
      peran: params[4] || 'barista',
      id_cabang: params[5] || 1
    };
    memoryStore.pengguna.push(newPengguna);
    return { insertId: newId, affectedRows: 1 };
  }

  if (normalized.startsWith('insert into cabang')) {
    const newId = memoryStore.cabang.length > 0 ? Math.max(...memoryStore.cabang.map(c => c.id_cabang)) + 1 : 1;
    const newCabang = {
      id_cabang: newId,
      nama_cabang: params[0],
      alamat: params[1] || null
    };
    memoryStore.cabang.push(newCabang);
    return { insertId: newId, affectedRows: 1 };
  }

  if (normalized.startsWith('select') && normalized.includes('from menu')) {
    if (normalized.includes('where id_menu =')) {
      return memoryStore.menu.filter(m => m.id_menu === Number(params[0]));
    }
    return [...memoryStore.menu];
  }

  if (normalized.startsWith('select') && normalized.includes('from resep')) {
    if (normalized.includes('where r.id_menu =') || normalized.includes('where id_menu =')) {
      const menuId = Number(params[0]);
      return memoryStore.resep
        .filter(r => r.id_menu === menuId)
        .map(r => {
          const bb = memoryStore.bahan_baku.find(b => b.id_bahan === r.id_bahan);
          return {
            ...r,
            nama_bahan: bb ? bb.nama_bahan : 'Unknown',
            satuan: bb ? bb.satuan : 'gram',
            stok_tersisa: bb ? bb.stok_tersisa : 0,
            stok_minimal: bb ? bb.stok_minimal : 0
          };
        });
    }
    return [...memoryStore.resep];
  }

  if (normalized.startsWith('select') && normalized.includes('from bahan_baku')) {
    if (normalized.includes('stok_tersisa <= stok_minimal')) {
      return memoryStore.bahan_baku.filter(b => Number(b.stok_tersisa) <= Number(b.stok_minimal));
    }
    if (normalized.includes('where id_bahan =')) {
      return memoryStore.bahan_baku.filter(b => b.id_bahan === Number(params[0]));
    }
    return [...memoryStore.bahan_baku];
  }

  if (normalized.startsWith('insert into menu')) {
    const newId = memoryStore.menu.length > 0 ? Math.max(...memoryStore.menu.map(m => m.id_menu)) + 1 : 1;
    const item = {
      id_menu: newId,
      nama_menu: params[0],
      kategori: params[1],
      harga_jual: Number(params[2]),
      id_cabang: Number(params[3]) || 1
    };
    memoryStore.menu.push(item);
    return { insertId: newId, affectedRows: 1 };
  }

  if (normalized.startsWith('update menu')) {
    const idMenu = Number(params[3]);
    const idx = memoryStore.menu.findIndex(m => m.id_menu === idMenu);
    if (idx !== -1) {
      memoryStore.menu[idx].nama_menu = params[0];
      memoryStore.menu[idx].kategori = params[1];
      memoryStore.menu[idx].harga_jual = Number(params[2]);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (normalized.startsWith('delete from menu')) {
    const idMenu = Number(params[0]);
    memoryStore.menu = memoryStore.menu.filter(m => m.id_menu !== idMenu);
    memoryStore.resep = memoryStore.resep.filter(r => r.id_menu !== idMenu);
    return { affectedRows: 1 };
  }

  if (normalized.startsWith('insert into resep')) {
    const newId = memoryStore.resep.length > 0 ? Math.max(...memoryStore.resep.map(r => r.id_resep)) + 1 : 1;
    const resepItem = {
      id_resep: newId,
      id_menu: Number(params[0]),
      id_bahan: Number(params[1]),
      takaran: Number(params[2])
    };
    memoryStore.resep.push(resepItem);
    return { insertId: newId, affectedRows: 1 };
  }

  if (normalized.startsWith('delete from resep where id_menu =')) {
    const idMenu = Number(params[0]);
    memoryStore.resep = memoryStore.resep.filter(r => r.id_menu !== idMenu);
    return { affectedRows: 1 };
  }

  if (normalized.startsWith('update bahan_baku b join resep r')) {
    const multiplier = Number(params[0]);
    const idMenu = Number(params[1]);
    const resepItems = memoryStore.resep.filter(r => r.id_menu === idMenu);
    for (const r of resepItems) {
      const bb = memoryStore.bahan_baku.find(b => b.id_bahan === r.id_bahan);
      if (bb) {
        bb.stok_tersisa = Math.max(0, Number(bb.stok_tersisa) - (Number(r.takaran) * multiplier));
      }
    }
    return { affectedRows: resepItems.length };
  }

  if (normalized.startsWith('insert into transaksi')) {
    const newId = memoryStore.transaksi.length > 0 ? Math.max(...memoryStore.transaksi.map(t => t.id_transaksi)) + 1 : 1;
    const trx = {
      id_transaksi: newId,
      kode_transaksi: params[0],
      id_pengguna: Number(params[1]),
      total_harga: Number(params[2]),
      metode_bayar: params[3],
      tanggal_transaksi: new Date().toISOString()
    };
    memoryStore.transaksi.push(trx);
    return { insertId: newId, affectedRows: 1 };
  }

  if (normalized.startsWith('insert into detail_transaksi')) {
    const newId = memoryStore.detail_transaksi.length > 0 ? Math.max(...memoryStore.detail_transaksi.map(d => d.id_detail)) + 1 : 1;
    const detail = {
      id_detail: newId,
      id_transaksi: Number(params[0]),
      id_menu: Number(params[1]),
      jumlah_porsi: Number(params[2]),
      subtotal: Number(params[3])
    };
    memoryStore.detail_transaksi.push(detail);
    return { insertId: newId, affectedRows: 1 };
  }

  return [];
}
