import express from 'express';
import { getAllPenyakit, getPenyakitById, createPenyakit, updatePenyakit, deletePenyakit } from '../controllers/penyakitController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['ADMIN', 'DOKTER', 'PERAWAT']));

router.get('/', getAllPenyakit);
router.get('/:id', getPenyakitById);
router.post('/', createPenyakit);
router.put('/:id', updatePenyakit);
router.delete('/:id', deletePenyakit);

export default router;
