import express from 'express';
import { getAllFasilitas, getFasilitasById, createFasilitas, updateFasilitas, deleteFasilitas } from '../controllers/fasilitasController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.get('/', getAllFasilitas);
router.get('/:id', getFasilitasById);

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.post('/', createFasilitas);
router.put('/:id', updateFasilitas);
router.delete('/:id', deleteFasilitas);

export default router;
