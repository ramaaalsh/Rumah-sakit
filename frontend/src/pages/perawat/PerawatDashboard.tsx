import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Bed, 
  LogOut, 
  Activity, 
  CheckCircle2,
  Calendar,
  Clock,
  Search,
  LayoutDashboard
} from 'lucide-react';

interface PatientData {
  id_jenis_rawat: number;
  tipe_rawat: 'RAWAT_INAP' | 'RAWAT_JALAN';
  tanggal_masuk: string | null;
  tanggal_keluar: string | null;
  no_antrian: string | null;
  status_kontrol: string | null;
  kamar: { no_kamar: string; kelas: string } | null;
  pemeriksaan: {
    tanggal_pemeriksaan: string;
    keluhan: string;
    diagnosa: string;
    dokter: { nama: string };
    pendaftaran: {
      tanggal_daftar: string;
      pasien: { nama: string };
    };
  } | null;
  resep: {
    obat: { nama_obat: string; harga: number }[];
  }[];
}

interface RoomData {
  id_kamar: number;
  no_kamar: string;
  kelas: string;
  tarif: number;
  status: 'TERPAKAI' | 'TERSEDIA';
  pasienNama: string | null;
}

export const PerawatDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [patientsRes, roomsRes] = await Promise.all([
        api.get('/perawat/data-pasien'),
        api.get('/perawat/status-kamar')
      ]);
      setPatients(patientsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckout = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin melakukan checkout untuk pasien ini?')) return;
    try {
      await api.put(`/perawat/checkout/${id}`);
      alert('Pasien berhasil checkout!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Gagal melakukan checkout');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredPatients = patients.filter(p => 
    p.pemeriksaan?.pendaftaran?.pasien?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-100">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard Perawat</h1>
            <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              {user?.nama} • Online
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-all px-5 py-2.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </header>

      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full space-y-12">
        
        {/* Section 1: Daftar Pasien */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Users className="w-8 h-8 text-emerald-600" />
                Daftar Semua Pasien & Status Rawat
              </h2>
              <p className="text-gray-500 font-medium">Monitoring status dan rekam medis pasien</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari nama pasien..."
                className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-full md:w-80 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Pasien</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Detail Pemeriksaan</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status Rawat</th>
                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Resep Obat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-400 font-medium italic">
                        Tidak ada data pasien ditemukan
                      </td>
                    </tr>
                  ) : filteredPatients.map((p) => (
                    <tr key={p.id_jenis_rawat} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl group-hover:scale-110 transition-transform">
                            {p.pemeriksaan?.pendaftaran?.pasien?.nama?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 mb-0.5">{p.pemeriksaan?.pendaftaran?.pasien?.nama || 'Pasien Anonim'}</div>
                            <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Daftar: {formatDate(p.pemeriksaan?.pendaftaran?.tanggal_daftar || null)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              {formatDate(p.pemeriksaan?.tanggal_pemeriksaan || null)}
                            </span>
                            <span className="text-xs font-bold text-gray-500 italic">oleh {p.pemeriksaan?.dokter?.nama || 'Dokter Tidak Diketahui'}</span>
                          </div>
                          <div className="text-sm font-bold text-gray-800 line-clamp-1">{p.pemeriksaan?.diagnosa || 'Belum ada diagnosa'}</div>
                          <div className="text-xs text-gray-500 italic line-clamp-1">"{p.pemeriksaan?.keluhan || '-'}"</div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {p.tipe_rawat === 'RAWAT_INAP' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs font-black bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
                                  <Bed className="w-3 h-3" /> RAWAT INAP
                                </span>
                                <span className="text-xs font-black text-gray-800">Room {p.kamar?.no_kamar}</span>
                              </div>
                              {!p.tanggal_keluar && (
                                <button 
                                  onClick={() => handleCheckout(p.id_jenis_rawat)}
                                  className="text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-all active:scale-95"
                                >
                                  CHECK OUT
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                <Clock className="w-3 h-3" /> Masuk: {formatDate(p.tanggal_masuk)}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                <Clock className="w-3 h-3" /> {p.tanggal_keluar ? 'Keluar: ' + formatDate(p.tanggal_keluar) : 'Masih dirawat'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="flex items-center gap-1 w-fit text-xs font-black bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 uppercase">
                              <Activity className="w-3 h-3" /> Rawat Jalan
                            </span>
                            <div className="text-sm font-black text-gray-800">No. Antrian: {p.no_antrian}</div>
                            <div className="text-[10px] font-bold text-gray-400">Status: {p.status_kontrol || 'Umum'}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-1.5">
                          {p.resep.flatMap(r => r.obat).map((o, idx) => (
                            <span key={idx} className="bg-white border border-gray-200 text-[10px] font-black text-gray-600 px-2.5 py-1 rounded-lg shadow-sm">
                              {o.nama_obat}
                            </span>
                          ))}
                          {p.resep.length === 0 && <span className="text-xs text-gray-400 italic">Tanpa resep</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2: Status Kamar */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Bed className="w-8 h-8 text-emerald-600" />
                Status & Ketersediaan Kamar
              </h2>
              <p className="text-gray-500 font-medium">Informasi kapasitas dan hunian ruang rawat</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="space-y-8">
              {['VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3'].map(kelas => {
                const classRooms = rooms.filter(r => r.kelas === kelas);
                if (classRooms.length === 0) return null;

                return (
                  <div key={kelas} className="space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                      <span>{kelas}</span>
                      <div className="h-[1px] flex-1 bg-gray-100"></div>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                      {classRooms.map(r => (
                        <div 
                          key={r.id_kamar} 
                          className={`group relative p-3 rounded-2xl border transition-all hover:scale-105 cursor-default ${
                            r.status === 'TERPAKAI' 
                              ? 'bg-red-50 border-red-100 text-red-700' 
                              : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1 text-center">
                            <Bed className={`w-5 h-5 ${r.status === 'TERPAKAI' ? 'text-red-400' : 'text-emerald-400'}`} />
                            <span className="text-sm font-black tracking-tighter leading-none">{r.no_kamar}</span>
                            <span className="text-[9px] font-bold uppercase opacity-60 leading-none">{r.status}</span>
                          </div>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-[10px] p-2.5 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 shadow-xl border border-gray-800 pointer-events-none">
                            <div className="font-black mb-1 flex justify-between border-b border-gray-800 pb-1">
                              <span>Kamar {r.no_kamar}</span>
                              <span className={r.status === 'TERPAKAI' ? 'text-red-400' : 'text-emerald-400'}>{r.status}</span>
                            </div>
                            <div className="space-y-0.5 pt-1">
                              <div>Kelas: {r.kelas}</div>
                              <div>Tarif: {formatCurrency(r.tarif)}</div>
                              {r.status === 'TERPAKAI' && (
                                <div className="mt-1.5 pt-1.5 border-t border-gray-800 text-blue-300 font-bold">
                                  Pasien: {r.pasienNama}
                                </div>
                              )}
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};
