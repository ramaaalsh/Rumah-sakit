import express from 'express';
import { getAllJenisRawat, getJenisRawatById, createJenisRawat, updateJenisRawat, deleteJenisRawat } from '../controllers/jenisRawatController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllJenisRawat);
router.get('/:id', getJenisRawatById);
router.post('/', createJenisRawat);
router.put('/:id', updateJenisRawat);
router.delete('/:id', deleteJenisRawat);

export default router;
