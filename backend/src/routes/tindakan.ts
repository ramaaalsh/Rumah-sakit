import express from 'express';
import { getAllTindakan, getTindakanById, createTindakan, updateTindakan, deleteTindakan } from '../controllers/tindakanController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllTindakan);
router.get('/:id', getTindakanById);
router.post('/', createTindakan);
router.put('/:id', updateTindakan);
router.delete('/:id', deleteTindakan);

export default router;
