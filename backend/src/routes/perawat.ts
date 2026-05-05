import express from 'express';
import { getDataPasien, getStatusKamar, checkoutPasien } from '../controllers/perawatController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['PERAWAT']));

router.get('/data-pasien', getDataPasien);
router.get('/status-kamar', getStatusKamar);
router.put('/checkout/:id_jenis_rawat', checkoutPasien);

export default router;
