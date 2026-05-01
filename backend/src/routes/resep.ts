import express from 'express';
import { getAllResep, getResepById, createResep, updateResep, deleteResep } from '../controllers/resepController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllResep);
router.get('/:id', getResepById);
router.post('/', createResep);
router.put('/:id', updateResep);
router.delete('/:id', deleteResep);

export default router;
