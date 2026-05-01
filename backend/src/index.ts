import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import pasienRoutes from './routes/pasien';
import pegawaiRoutes from './routes/pegawai';
import pendaftaranRoutes from './routes/pendaftaran';
import pemeriksaanRoutes from './routes/pemeriksaan';
import penyakitRoutes from './routes/penyakit';
import tindakanRoutes from './routes/tindakan';
import jenisRawatRoutes from './routes/jenisRawat';
import kamarRoutes from './routes/kamar';
import obatRoutes from './routes/obat';
import resepRoutes from './routes/resep';
import detailObatRoutes from './routes/detailObat';
import pembayaranRoutes from './routes/pembayaran';
import fasilitasRoutes from './routes/fasilitas';
import jadwalDokterRoutes from './routes/jadwalDokter';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/pemeriksaan', pemeriksaanRoutes);
app.use('/api/penyakit', penyakitRoutes);
app.use('/api/tindakan', tindakanRoutes);
app.use('/api/jenis-rawat', jenisRawatRoutes);
app.use('/api/kamar', kamarRoutes);
app.use('/api/obat', obatRoutes);
app.use('/api/resep', resepRoutes);
app.use('/api/detail-obat', detailObatRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/fasilitas', fasilitasRoutes);
app.use('/api/jadwal-dokter', jadwalDokterRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API RS Kelompok 2 Berjalan!' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
