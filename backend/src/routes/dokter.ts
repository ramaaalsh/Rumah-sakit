import express from 'express';
import { getPasienSaya, getDataPendukung, inputTindakanMedis } from '../controllers/dokterController';
import { authenticateJWT } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';

const router = express.Router();

router.use(authenticateJWT);
router.use(requireRole(['DOKTER']));

router.get('/pasien-saya', getPasienSaya);
router.get('/data-pendukung', getDataPendukung);
router.put('/input-tindakan/:id_pemeriksaan', inputTindakanMedis);

export default router;
