import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import penggunaRouter from './routes/pengguna.js';
import produkRouter from './routes/produk.js';
import { errorHandler } from './middleware/error.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();
const PORT = process.env.PORT || 3000;
// Enable CORS and JSON parsing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API Root & Health Check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'online',
        system: 'Kopi Kazu POS v2.4 API',
        timestamp: new Date().toISOString()
    });
});
// Primary Routes
app.use('/api/pengguna', penggunaRouter);
app.use('/api/produk', produkRouter);
// Convenience aliases for backward/forward route compatibility
app.use('/api/menu', produkRouter);
app.use('/api/bahan', (req, res, next) => {
    req.url = req.url === '/' ? '/bahan' : `/bahan${req.url}`;
    produkRouter(req, res, next);
});
app.use('/api/transaksi', (req, res, next) => {
    if (req.url === '/checkout') {
        produkRouter(req, res, next);
    }
    else {
        next();
    }
});
// Central Error Handler Middleware
app.use(errorHandler);
// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`☕ Kopi Kazu POS v2.4 Backend running on http://localhost:${PORT}`);
    });
}
export default app;
