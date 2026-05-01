import express from 'express';
import { getAllJadwalDokter, getJadwalDokterById, createJadwalDokter, updateJadwalDokter, deleteJadwalDokter } from '../controllers/jadwalDokterController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.get('/', getAllJadwalDokter);
router.get('/:id', getJadwalDokterById);

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.post('/', createJadwalDokter);
router.put('/:id', updateJadwalDokter);
router.delete('/:id', deleteJadwalDokter);

export default router;
