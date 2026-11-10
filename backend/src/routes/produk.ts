import { Router } from 'express';
import { produkController } from '../controller/produk.js';

const router = Router();

router.get('/menu', (req, res, next) => produkController.getAllMenu(req, res, next));
router.get('/menu/:id', (req, res, next) => produkController.getMenuById(req, res, next));
router.post('/menu', (req, res, next) => produkController.createMenu(req, res, next));
router.put('/menu/:id', (req, res, next) => produkController.updateMenu(req, res, next));
router.delete('/menu/:id', (req, res, next) => produkController.deleteMenu(req, res, next));

router.get('/bahan', (req, res, next) => produkController.getAllBahanBaku(req, res, next));
router.get('/bahan/kritis', (req, res, next) => produkController.getBahanKritis(req, res, next));

router.post('/checkout', (req, res, next) => produkController.checkout(req, res, next));

export default router;

