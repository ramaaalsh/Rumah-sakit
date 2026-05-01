import express from 'express';
import { getAllPendaftaran, getPendaftaranById, createPendaftaran, updatePendaftaran, deletePendaftaran } from '../controllers/pendaftaranController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllPendaftaran);
router.get('/:id', getPendaftaranById);
router.post('/', createPendaftaran);
router.put('/:id', updatePendaftaran);
router.delete('/:id', deletePendaftaran);

export default router;
