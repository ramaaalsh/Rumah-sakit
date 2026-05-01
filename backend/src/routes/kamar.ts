import express from 'express';
import { getAllKamar, getKamarById, createKamar, updateKamar, deleteKamar } from '../controllers/kamarController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllKamar);
router.get('/:id', getKamarById);
router.post('/', createKamar);
router.put('/:id', updateKamar);
router.delete('/:id', deleteKamar);

export default router;
