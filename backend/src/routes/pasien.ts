import express from 'express';
import { getAllPasien, getPasienById, createPasien, updatePasien, deletePasien } from '../controllers/pasienController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'PERAWAT', 'DOKTER']));

router.get('/', getAllPasien);
router.get('/:id', getPasienById);
router.post('/', createPasien);
router.put('/:id', updatePasien);
router.delete('/:id', deletePasien);

export default router;
