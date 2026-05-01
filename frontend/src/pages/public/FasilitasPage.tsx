import React, { useEffect, useState } from 'react';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import api from '../../services/api';
import { Fasilitas } from '../../types';

export const FasilitasPage: React.FC = () => {
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFasilitas = async () => {
      try {
        const res = await api.get('/fasilitas');
        setFasilitas(res.data);
      } catch (error) {
        console.error('Failed to fetch fasilitas', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFasilitas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      
      <div className="bg-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Fasilitas Rumah Sakit</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Kami menyediakan berbagai fasilitas kesehatan dengan peralatan medis modern 
            untuk memastikan pelayanan terbaik bagi Anda.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fasilitas.map((f) => (
              <div key={f.id_fasilitas} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-6 bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center">
                  {f.icon || '🏥'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.nama_fasilitas}</h3>
                <p className="text-gray-600 leading-relaxed">{f.deskripsi}</p>
              </div>
            ))}
            
            {fasilitas.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                Data fasilitas belum tersedia.
              </div>
            )}
          </div>
        )}
      </div>

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
