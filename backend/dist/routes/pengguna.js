import { Router } from 'express';
import { penggunaController } from '../controller/pengguna.js';
const router = Router();
router.post('/login', (req, res, next) => penggunaController.login(req, res, next));
router.post('/register', (req, res, next) => penggunaController.register(req, res, next));
router.get('/cabang', (req, res, next) => penggunaController.getAllCabang(req, res, next));
export default router;
