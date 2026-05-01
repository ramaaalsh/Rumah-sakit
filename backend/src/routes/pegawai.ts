import express from 'express';
import { getAllPegawai, getDokter, getPegawaiById, createPegawai, updatePegawai, deletePegawai } from '../controllers/pegawaiController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

// Public route
router.get('/dokter', getDokter);

// Protected routes
router.use(authenticateJWT);
router.use(requireRole(['ADMIN']));

router.get('/', getAllPegawai);
router.get('/:id', getPegawaiById);
router.post('/', createPegawai);
router.put('/:id', updatePegawai);
router.delete('/:id', deletePegawai);

export default router;
