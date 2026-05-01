import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Table } from '../../components/admin/Table';
import { Users, UserCog, CalendarDays, Receipt } from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalPasien: 0,
    totalPegawai: 0,
    pendaftaranHariIni: 0,
    totalPembayaran: 0
  });
  
  const [recentPendaftaran, setRecentPendaftaran] = useState([]);
  const [recentPembayaran, setRecentPembayaran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [pasienRes, pegawaiRes, pendaftaranRes, pembayaranRes] = await Promise.all([
          api.get('/pasien'),
          api.get('/pegawai'),
          api.get('/pendaftaran'),
          api.get('/pembayaran')
        ]);

        const today = new Date().toISOString().split('T')[0];
        
        const pendaftaranToday = pendaftaranRes.data.filter((p: any) => 
          new Date(p.tanggal_daftar).toISOString().split('T')[0] === today
        );

        const totalPendapatan = pembayaranRes.data.reduce((sum: number, p: any) => sum + p.jumlah, 0);

        setStats({
          totalPasien: pasienRes.data.length,
          totalPegawai: pegawaiRes.data.length,
          pendaftaranHariIni: pendaftaranToday.length,
          totalPembayaran: totalPendapatan
        });

        // Sort by date desc and take 5
        setRecentPendaftaran(
          pendaftaranRes.data
            .sort((a: any, b: any) => new Date(b.tanggal_daftar).getTime() - new Date(a.tanggal_daftar).getTime())
            .slice(0, 5)
        );

        setRecentPembayaran(
          pembayaranRes.data
            .sort((a: any, b: any) => new Date(b.tgl_pembayaran).getTime() - new Date(a.tgl_pembayaran).getTime())
            .slice(0, 5)
        );
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali, {user?.nama}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="bg-blue-100 p-4 rounded-full mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pasien</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPasien}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="bg-green-100 p-4 rounded-full mr-4">
            <UserCog className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pegawai</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPegawai}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="bg-orange-100 p-4 rounded-full mr-4">
            <CalendarDays className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pendaftaran Hari Ini</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendaftaranHariIni}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center">
          <div className="bg-purple-100 p-4 rounded-full mr-4">
            <Receipt className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pembayaran</p>
            <p className="text-2xl font-bold text-gray-900">{formatRupiah(stats.totalPembayaran)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendaftaran Terbaru */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Pendaftaran Terbaru</h2>
          </div>
          <Table
            data={recentPendaftaran}
            keyExtractor={(row) => row.id_pendaftaran}
            columns={[
              { header: 'Pasien', accessor: (row) => row.pasien?.nama || '-' },
              { header: 'Tanggal', accessor: (row) => formatDate(row.tanggal_daftar) },
              { header: 'Keterangan', accessor: 'keterangan_daftar' },
              { header: 'Admin', accessor: (row) => row.admin?.nama || '-' }
            ]}
          />
        </div>

        {/* Pembayaran Terbaru */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Pembayaran Terbaru</h2>
          </div>
          <Table
            data={recentPembayaran}
            keyExtractor={(row) => row.id_pembayaran}
            columns={[
              { header: 'Pasien', accessor: (row) => row.pasien?.nama || '-' },
              { header: 'Tanggal', accessor: (row) => formatDate(row.tgl_pembayaran) },
              { header: 'Jumlah', accessor: (row) => formatRupiah(row.jumlah) },
              { header: 'Metode', accessor: 'metode_pembayaran' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};
