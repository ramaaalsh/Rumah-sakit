import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { DokterPage } from './pages/public/DokterPage';
import { FasilitasPage } from './pages/public/FasilitasPage';
import { LoginPage } from './pages/LoginPage';

// Admin Layout
import { AdminLayout } from './components/admin/AdminLayout';

// Admin Pages
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { PasienPage } from './pages/admin/PasienPage';
import { PegawaiPage } from './pages/admin/PegawaiPage';
import { PendaftaranPage } from './pages/admin/PendaftaranPage';
import { ObatPage } from './pages/admin/ObatPage';
import { KamarPage } from './pages/admin/KamarPage';
import { PemeriksaanPage } from './pages/admin/PemeriksaanPage';
import { PembayaranPage } from './pages/admin/PembayaranPage';
import { FasilitasAdminPage } from './pages/admin/FasilitasAdminPage';
import { JadwalDokterPage } from './pages/admin/JadwalDokterPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dokter" element={<DokterPage />} />
        <Route path="/fasilitas" element={<FasilitasPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="pasien" element={<PasienPage />} />
          <Route path="pegawai" element={<PegawaiPage />} />
          <Route path="pendaftaran" element={<PendaftaranPage />} />
          <Route path="obat" element={<ObatPage />} />
          <Route path="pemeriksaan" element={<PemeriksaanPage />} />
          <Route path="kamar" element={<KamarPage />} />
          <Route path="pembayaran" element={<PembayaranPage />} />
          <Route path="fasilitas" element={<FasilitasAdminPage />} />
          <Route path="jadwal-dokter" element={<JadwalDokterPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
