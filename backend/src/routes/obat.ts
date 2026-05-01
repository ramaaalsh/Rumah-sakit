import express from 'express';
import { getAllObat, getObatById, createObat, updateObat, deleteObat } from '../controllers/obatController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllObat);
router.get('/:id', getObatById);
router.post('/', createObat);
router.put('/:id', updateObat);
router.delete('/:id', deleteObat);

export default router;
