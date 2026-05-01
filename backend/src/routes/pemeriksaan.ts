import express from 'express';
import { getAllPemeriksaan, getPemeriksaanById, createPemeriksaan, updatePemeriksaan, deletePemeriksaan } from '../controllers/pemeriksaanController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllPemeriksaan);
router.get('/:id', getPemeriksaanById);
router.post('/', createPemeriksaan);
router.put('/:id', updatePemeriksaan);
router.delete('/:id', deletePemeriksaan);

export default router;
