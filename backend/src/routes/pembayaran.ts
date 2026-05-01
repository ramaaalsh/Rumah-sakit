import express from 'express';
import { getAllPembayaran, getPembayaranById, createPembayaran, updatePembayaran, deletePembayaran } from '../controllers/pembayaranController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllPembayaran);
router.get('/:id', getPembayaranById);
router.post('/', createPembayaran);
router.put('/:id', updatePembayaran);
router.delete('/:id', deletePembayaran);

export default router;
