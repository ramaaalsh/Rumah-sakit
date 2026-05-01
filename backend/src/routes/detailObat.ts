import express from 'express';
import { getAllDetailObat, getDetailObatById, createDetailObat, updateDetailObat, deleteDetailObat } from '../controllers/detailObatController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllDetailObat);
router.get('/:id', getDetailObatById);
router.post('/', createDetailObat);
router.put('/:id', updateDetailObat);
router.delete('/:id', deleteDetailObat);

export default router;
