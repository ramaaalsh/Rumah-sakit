import React, { useEffect, useState } from 'react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import api from '../../services/api';
import { Pegawai } from '../../types';
import { Calendar, Search } from 'lucide-react';

export const DokterPage: React.FC = () => {
  const [dokter, setDokter] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpesialisasi, setFilterSpesialisasi] = useState<string>('');

  useEffect(() => {
    const fetchDokter = async () => {
      try {
        const res = await api.get('/pegawai/dokter');
        setDokter(res.data);
      } catch (error) {
        console.error('Failed to fetch dokter', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDokter();
  }, []);

  // Ambil daftar spesialisasi unik untuk dropdown
  const spesialisasiList = Array.from(new Set(dokter.map(d => d.spesialisasi || 'Umum'))).sort();

  const filteredDokter = filterSpesialisasi 
    ? dokter.filter(d => (d.spesialisasi || 'Umum') === filterSpesialisasi)
    : dokter;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      
      <div className="bg-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cari Dokter</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Temukan dokter spesialis yang sesuai dengan kebutuhan kesehatan Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-700 font-medium">
            <Search className="w-5 h-5 mr-2 text-gray-400" />
            <span>Filter Spesialisasi:</span>
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white w-full sm:w-auto"
            value={filterSpesialisasi}
            onChange={(e) => setFilterSpesialisasi(e.target.value)}
          >
            <option value="">Semua Spesialisasi</option>
            {spesialisasiList.map(sp => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDokter.map((d) => (
              <div key={d.id_pegawai} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold shrink-0">
                    {d.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{d.nama}</h3>
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-2">
                      Spesialis {d.spesialisasi || 'Umum'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4" /> Jadwal Praktek
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {d.jadwal && d.jadwal.length > 0 ? (
                      d.jadwal.map(j => (
                        <li key={j.id_jadwal} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md">
                          <span className="font-medium text-gray-700">{j.hari}</span>
                          <span>{j.jam_mulai} - {j.jam_selesai}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">Jadwal belum tersedia</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
            
            {filteredDokter.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Tidak ada dokter yang ditemukan untuk spesialisasi ini.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Minimal Footer for other pages */}
      <footer className="bg-blue-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} Sistem Informasi RS Kelompok 2
          </p>
        </div>
      </footer>
    </div>
  );
};
