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

// Dokter Pages
import { DokterDashboard } from './pages/dokter/DokterDashboard';

// Perawat Pages
import { PerawatDashboard } from './pages/perawat/PerawatDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected Dokter Routes */}
        <Route path="/dokter/dashboard" element={
          <ProtectedRoute allowedRoles={['DOKTER']}>
            <DokterDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Perawat Routes */}
        <Route path="/perawat/dashboard" element={
          <ProtectedRoute allowedRoles={['PERAWAT']}>
            <PerawatDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
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

        {/* Public Pages */}
        <Route path="/dokter" element={<DokterPage />} />
        <Route path="/fasilitas" element={<FasilitasPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
