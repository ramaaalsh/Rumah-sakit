import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/public/PublicNavbar';
import api from '../../services/api';
import { Pegawai, Fasilitas } from '../../types';
import { ArrowRight, Calendar, Clock, MapPin, Phone, Stethoscope } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [dokter, setDokter] = useState<Pegawai[]>([]);
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dokterRes, fasilitasRes] = await Promise.all([
          api.get('/pegawai/dokter'),
          api.get('/fasilitas')
        ]);
        setDokter(dokterRes.data.slice(0, 3)); // Ambil 3 saja untuk landing page
        setFasilitas(fasilitasRes.data.slice(0, 3)); // Ambil 3 fasilitas
      } catch (error) {
        console.error('Failed to fetch landing page data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Selamat Datang di RS Kelompok 3
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl">
            Memberikan pelayanan kesehatan terbaik untuk Anda dan keluarga dengan sepenuh hati.
          </p>
          <div className="flex gap-4">
            <Link 
              to="/dokter"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Lihat Dokter Kami
            </Link>
            <Link 
              to="/fasilitas"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Fasilitas Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Fasilitas Kami</h2>
            <p className="mt-4 text-lg text-gray-600">Fasilitas modern untuk menunjang kesehatan Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fasilitas.map((f) => (
              <div key={f.id_fasilitas} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon || '🏥'}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.nama_fasilitas}</h3>
                <p className="text-gray-600">{f.deskripsi}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/fasilitas" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
              Lihat semua fasilitas <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dokter Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Dokter Kami</h2>
            <p className="mt-4 text-lg text-gray-600">Ditangani oleh tenaga medis profesional dan berpengalaman</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dokter.map((d) => (
              <div key={d.id_pegawai} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                    {d.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{d.nama}</h3>
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-1">
                      Spesialis {d.spesialisasi || 'Umum'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" /> Jadwal Praktek
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {d.jadwal && d.jadwal.length > 0 ? (
                      d.jadwal.map(j => (
                        <li key={j.id_jadwal} className="flex justify-between">
                          <span>{j.hari}</span>
                          <span className="font-medium">{j.jam_mulai} - {j.jam_selesai}</span>
                        </li>
                      ))
                    ) : (
                      <li>Jadwal belum tersedia</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/dokter" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800">
              Lihat semua dokter <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kontak Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hubungi Kami</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Alamat</h3>
                    <p className="text-gray-600">Jl. Kesehatan No. 123, Jakarta Selatan<br/>DKI Jakarta 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Telepon / IGD</h3>
                    <p className="text-gray-600">(021) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Jam Operasional</h3>
                    <p className="text-gray-600">IGD 24 Jam<br/>Poliklinik: Senin-Sabtu, 08:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center shadow-inner">
              {/* Map Placeholder */}
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">Lokasi RS Kelompok 2</p>
                <p className="text-sm">Peta Interaktif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Stethoscope className="w-6 h-6" />
            <span className="font-bold text-xl">RS Kelompok 2</span>
          </div>
          <p className="text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} Sistem Informasi RS Kelompok 2. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};
