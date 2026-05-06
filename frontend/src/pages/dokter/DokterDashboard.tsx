import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Calendar, 
  Clipboard, 
  Stethoscope, 
  Bed, 
  Clock, 
  MapPin, 
  Phone, 
  LogOut,
  ChevronRight,
  Pill,
  Activity,
  Plus,
  Trash2,
  Save,
  Info
} from 'lucide-react';
import { Modal } from '../../components/admin/Modal';

interface PatientData {
  id_pemeriksaan: number;
  tanggal_pemeriksaan: string;
  keluhan: string;
  diagnosa: string;
  pendaftaran: {
    status: 'MENUNGGU' | 'DALAM_TINDAKAN' | 'SELESAI';
    pasien: {
      nama: string;

      jenis_kelamin: string;
      tanggal_lahir: string;
      jalan: string;
      kota: string;
      kode_pos: string;
      no_telp: { no_telp: string }[];
    }
  };
  penyakit: { id_penyakit: number; nama_penyakit: string }[];
  jenis_rawat: {
    id_jenis_rawat: number;
    tipe_rawat: 'RAWAT_INAP' | 'RAWAT_JALAN';
    no_antrian: string | null;
    kamar: { id_kamar: number; no_kamar: string; kelas: string } | null;
    tindakan: { nama_tindakan: string; biaya_tindakan: number }[];
    resep: {
      obat: { id_obat: number; nama_obat: string; harga: number }[];
    }[];
  }[];
}

interface DataPendukung {
  penyakit: { id_penyakit: number; nama_penyakit: string }[];
  obat: { id_obat: number; nama_obat: string; harga: number; stok: number }[];
  kamar: { id_kamar: number; no_kamar: string; kelas: string; tarif: number; isAvailable: boolean }[];
}

export const DokterDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [dataPendukung, setDataPendukung] = useState<DataPendukung | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    keluhan: '',
    diagnosa: '',
    penyakitIds: [] as number[],
    tipe_rawat: 'RAWAT_JALAN' as 'RAWAT_JALAN' | 'RAWAT_INAP',
    kamarId: null as number | null,
    no_antrian: '',
    tindakan: [] as { nama: string, biaya: number }[],
    resep: [] as { obatId: number, jumlah: number, dosis: string, harga_satuan: number }[]
  });

  const fetchPatients = async () => {
    try {
      const res = await api.get('/dokter/pasien-saya');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataPendukung = async () => {
    try {
      const res = await api.get('/dokter/data-pendukung');
      setDataPendukung(res.data);
    } catch (err) {
      console.error('Failed to fetch support data:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDataPendukung();
  }, []);

  const openInputModal = (p: PatientData) => {
    setSelectedPatient(p);
    const existingJR = p.jenis_rawat[0];
    
    setFormData({
      keluhan: p.keluhan || '',
      diagnosa: p.diagnosa || '',
      penyakitIds: p.penyakit.map(py => py.id_penyakit),
      tipe_rawat: existingJR?.tipe_rawat || 'RAWAT_JALAN',
      kamarId: existingJR?.kamar?.id_kamar || null,
      no_antrian: existingJR?.no_antrian || '',
      tindakan: [],
      resep: []
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    setSaving(true);
    try {
      await api.put(`/dokter/input-tindakan/${selectedPatient.id_pemeriksaan}`, formData);
      alert('Data medis berhasil disimpan!');
      setIsModalOpen(false);
      fetchPatients();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Gagal menyimpan data medis');
    } finally {
      setSaving(false);
    }
  };

  const addTindakan = () => {
    setFormData({
      ...formData,
      tindakan: [...formData.tindakan, { nama: '', biaya: 0 }]
    });
  };

  const removeTindakan = (index: number) => {
    const newTindakan = [...formData.tindakan];
    newTindakan.splice(index, 1);
    setFormData({ ...formData, tindakan: newTindakan });
  };

  const addObat = () => {
    setFormData({
      ...formData,
      resep: [...formData.resep, { obatId: 0, jumlah: 1, dosis: '', harga_satuan: 0 }]
    });
  };

  const removeObat = (index: number) => {
    const newResep = [...formData.resep];
    newResep.splice(index, 1);
    setFormData({ ...formData, resep: newResep });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard Dokter</h1>
            <p className="text-xs font-medium text-blue-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              Selamat datang, {user?.nama}
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-all px-5 py-2.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Daftar Pasien Saya</h2>
            <p className="text-gray-500 font-medium mt-1">Kelola rekam medis dan instruksi perawatan</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 text-blue-700 text-sm font-bold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {patients.length} Pasien Terdaftar
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Memuat Data...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-white rounded-[2rem] border-4 border-dashed border-gray-100 p-20 text-center shadow-inner">
            <div className="bg-gray-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 transition-transform hover:rotate-0">
              <User className="text-gray-300 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Tidak ada pasien saat ini</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto">Anda belum memiliki jadwal atau riwayat pemeriksaan pasien terdaftar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {patients.map((p) => (
              <div key={p.id_pemeriksaan} className="group bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:border-blue-200 transition-all">
                <div className="flex flex-col lg:flex-row">
                  {/* Sidebar Info Pasien */}
                  <div className="w-full lg:w-96 bg-gray-50/50 p-8 border-r border-gray-100 flex flex-col">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="bg-blue-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                        {p.pendaftaran.pasien.nama.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{p.pendaftaran.pasien.nama}</h3>
                        <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block">
                          {p.pendaftaran.pasien.jenis_kelamin}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-5 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal Lahir</p>
                          <p className="text-sm font-bold text-gray-700">{formatDate(p.pendaftaran.pasien.tanggal_lahir)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat</p>
                          <p className="text-sm font-bold text-gray-700">{p.pendaftaran.pasien.jalan}, {p.pendaftaran.pasien.kota}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kontak</p>
                          <p className="text-sm font-bold text-gray-700">{p.pendaftaran.pasien.no_telp[0]?.no_telp || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Care Status */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      {p.jenis_rawat.length > 0 ? (
                        <div className={`p-5 rounded-2xl border-2 ${p.jenis_rawat[0].tipe_rawat === 'RAWAT_INAP' ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100'}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-xl ${p.jenis_rawat[0].tipe_rawat === 'RAWAT_INAP' ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'}`}>
                              {p.jenis_rawat[0].tipe_rawat === 'RAWAT_INAP' ? <Bed className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-black ${p.jenis_rawat[0].tipe_rawat === 'RAWAT_INAP' ? 'text-orange-700' : 'text-emerald-700'} uppercase tracking-widest`}>
                              {p.jenis_rawat[0].tipe_rawat.replace('_', ' ')}
                            </span>
                          </div>
                          {p.jenis_rawat[0].tipe_rawat === 'RAWAT_INAP' ? (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Kamar Terpilih</p>
                              <p className="text-sm font-black text-orange-800">No. {p.jenis_rawat[0].kamar?.no_kamar} ({p.jenis_rawat[0].kamar?.kelas})</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">No. Antrian</p>
                              <p className="text-xl font-black text-emerald-800">{p.jenis_rawat[0].no_antrian}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 italic bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                          <Info className="w-4 h-4" />
                          <span className="text-xs font-bold">Rencana rawat belum ditentukan</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Konten Utama */}
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Kunjungan: {formatDate(p.tanggal_pemeriksaan)}</span>
                        
                        {/* Status Badge */}
                        <span className={`ml-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          p.pendaftaran.status === 'SELESAI' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : p.pendaftaran.status === 'DALAM_TINDAKAN'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {p.pendaftaran.status}
                        </span>
                      </div>
                      <button 
                        onClick={() => openInputModal(p)}
                        className={`${
                          p.pendaftaran.status === 'SELESAI' 
                            ? 'bg-gray-800 hover:bg-black' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95`}
                      >
                        {p.pendaftaran.status === 'SELESAI' ? <Clipboard className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {p.pendaftaran.status === 'SELESAI' ? 'EDIT REKAM MEDIS' : 'TANGANI PASIEN'}
                      </button>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h4 className="font-black text-gray-900 tracking-tight">Keluhan & Diagnosa</h4>
                          </div>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Keluhan Pasien</p>
                              <p className="text-sm font-medium text-gray-700 leading-relaxed italic">"{p.keluhan || '-'}"</p>
                            </div>
                            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Diagnosa Medis</p>
                              <p className="text-sm font-black text-blue-900 leading-relaxed">{p.diagnosa || 'Belum diisi'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                            <h4 className="font-black text-gray-900 tracking-tight">Daftar Penyakit</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {p.penyakit.map((peny) => (
                              <span key={peny.id_penyakit} className="bg-red-50 text-red-700 text-[10px] font-black px-4 py-2 rounded-xl border border-red-100 shadow-sm uppercase tracking-wider">
                                {peny.nama_penyakit}
                              </span>
                            ))}
                            {p.penyakit.length === 0 && <span className="text-xs text-gray-400 font-medium italic bg-gray-50 px-4 py-2 rounded-xl">Belum ada penyakit terdeteksi</span>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                            <h4 className="font-black text-gray-900 tracking-tight">Tindakan Medis</h4>
                          </div>
                          <div className="space-y-2">
                            {p.jenis_rawat[0]?.tindakan.map((t, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-50 text-emerald-800 text-sm font-bold">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                {t.nama_tindakan}
                              </div>
                            ))}
                            {(!p.jenis_rawat[0]?.tindakan || p.jenis_rawat[0]?.tindakan.length === 0) && (
                              <div className="text-xs text-gray-400 font-medium italic py-2">Belum ada tindakan yang dicatat</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                            <h4 className="font-black text-gray-900 tracking-tight">Resep & Obat</h4>
                          </div>
                          <div className="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 flex flex-wrap gap-2">
                            {p.jenis_rawat[0]?.resep.flatMap(r => r.obat).map((o, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white text-purple-700 text-[10px] font-black px-4 py-2.5 rounded-xl border border-purple-200 shadow-sm transition-transform hover:scale-105">
                                <Pill className="w-3 h-3 text-purple-400" />
                                {o.nama_obat}
                              </div>
                            ))}
                            {(!p.jenis_rawat[0]?.resep || p.jenis_rawat[0]?.resep.length === 0) && (
                              <span className="text-xs text-purple-400 font-medium italic">Resep belum diterbitkan</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Input Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !saving && setIsModalOpen(false)} 
        title={`Penanganan Medis: ${selectedPatient?.pendaftaran.pasien.nama}`}
      >
        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Diagnosa */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clipboard className="w-4 h-4" />
              1. Hasil Pemeriksaan & Diagnosa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Keluhan Utama</label>
                <textarea 
                  required
                  value={formData.keluhan}
                  onChange={e => setFormData({...formData, keluhan: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-24"
                  placeholder="Deskripsi keluhan pasien..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diagnosa Medis</label>
                <textarea 
                  required
                  value={formData.diagnosa}
                  onChange={e => setFormData({...formData, diagnosa: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-24"
                  placeholder="Hasil diagnosa akhir..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Penyakit Terkait</label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                {dataPendukung?.penyakit.map(py => (
                  <button
                    key={py.id_penyakit}
                    type="button"
                    onClick={() => {
                      const exists = formData.penyakitIds.includes(py.id_penyakit);
                      setFormData({
                        ...formData,
                        penyakitIds: exists 
                          ? formData.penyakitIds.filter(id => id !== py.id_penyakit)
                          : [...formData.penyakitIds, py.id_penyakit]
                      });
                    }}
                    className={`text-[10px] font-black px-4 py-2 rounded-xl border transition-all ${
                      formData.penyakitIds.includes(py.id_penyakit)
                        ? 'bg-red-600 border-red-700 text-white shadow-lg shadow-red-100'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50'
                    }`}
                  >
                    {py.nama_penyakit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Care Type */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4" />
              2. Rencana Perawatan
            </h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, tipe_rawat: 'RAWAT_JALAN'})}
                className={`flex-1 p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.tipe_rawat === 'RAWAT_JALAN'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <Clock className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest">Rawat Jalan</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, tipe_rawat: 'RAWAT_INAP'})}
                className={`flex-1 p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.tipe_rawat === 'RAWAT_INAP'
                    ? 'bg-orange-50 border-orange-500 text-orange-800'
                    : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <Bed className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-widest">Rawat Inap</span>
              </button>
            </div>

            {formData.tipe_rawat === 'RAWAT_INAP' ? (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-1">Pilih Kamar Inap</label>
                <select 
                  required
                  value={formData.kamarId || ''}
                  onChange={e => setFormData({...formData, kamarId: parseInt(e.target.value)})}
                  className="w-full bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4 text-sm font-black text-orange-900 outline-none"
                >
                  <option value="">Pilih Kamar...</option>
                  {dataPendukung?.kamar.filter(k => k.isAvailable).map(k => (
                    <option key={k.id_kamar} value={k.id_kamar}>
                      Kamar {k.no_kamar} ({k.kelas}) - Rp {k.tarif.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">Nomor Antrian Kontrol</label>
                <input 
                  required
                  type="text"
                  value={formData.no_antrian}
                  onChange={e => setFormData({...formData, no_antrian: e.target.value})}
                  className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 text-sm font-black text-emerald-900 outline-none"
                  placeholder="Contoh: RJ-001"
                />
              </div>
            )}
          </div>

          {/* Section 3: Tindakan & Obat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">3. Tindakan</h4>
                <button 
                  type="button" 
                  onClick={addTindakan}
                  className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100"
                >
                  + Tambah
                </button>
              </div>
              <div className="space-y-3">
                {formData.tindakan.map((t, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex-1 space-y-2">
                      <input 
                        required
                        placeholder="Nama Tindakan"
                        value={t.nama}
                        onChange={e => {
                          const newT = [...formData.tindakan];
                          newT[idx].nama = e.target.value;
                          setFormData({...formData, tindakan: newT});
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                      <input 
                        required
                        type="number"
                        placeholder="Biaya"
                        value={t.biaya || ''}
                        onChange={e => {
                          const newT = [...formData.tindakan];
                          newT[idx].biaya = parseFloat(e.target.value);
                          setFormData({...formData, tindakan: newT});
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeTindakan(idx)}
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.tindakan.length === 0 && <div className="text-[10px] text-gray-400 font-bold italic text-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">Klik tambah untuk mencatat tindakan</div>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">4. Resep Obat</h4>
                <button 
                  type="button" 
                  onClick={addObat}
                  className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100"
                >
                  + Resepkan
                </button>
              </div>
              <div className="space-y-3">
                {formData.resep.map((r, idx) => (
                  <div key={idx} className="bg-purple-50 p-3 rounded-2xl border border-purple-100 space-y-2 relative">
                    <button 
                      type="button" 
                      onClick={() => removeObat(idx)}
                      className="absolute top-2 right-2 text-purple-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <select 
                      required
                      value={r.obatId || ''}
                      onChange={e => {
                        const newR = [...formData.resep];
                        const obat = dataPendukung?.obat.find(o => o.id_obat === parseInt(e.target.value));
                        newR[idx].obatId = parseInt(e.target.value);
                        newR[idx].harga_satuan = obat?.harga || 0;
                        setFormData({...formData, resep: newR});
                      }}
                      className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="">Pilih Obat...</option>
                      {dataPendukung?.obat.map(o => (
                        <option key={o.id_obat} value={o.id_obat} disabled={o.stok <= 0}>
                          {o.nama_obat} (Stok: {o.stok})
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input 
                        required
                        type="number"
                        placeholder="Qty"
                        value={r.jumlah}
                        onChange={e => {
                          const newR = [...formData.resep];
                          newR[idx].jumlah = parseInt(e.target.value);
                          setFormData({...formData, resep: newR});
                        }}
                        className="w-20 bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                      <input 
                        required
                        placeholder="Dosis (misal: 3x1)"
                        value={r.dosis}
                        onChange={e => {
                          const newR = [...formData.resep];
                          newR[idx].dosis = e.target.value;
                          setFormData({...formData, resep: newR});
                        }}
                        className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  </div>
                ))}
                {formData.resep.length === 0 && <div className="text-[10px] text-gray-400 font-bold italic text-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">Belum ada obat diresepkan</div>}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 rounded-2xl text-sm font-black text-gray-400 hover:text-gray-600 transition-colors"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-blue-100 transition-all hover:scale-105"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : <Save className="w-5 h-5" />}
              SIMPAN REKAM MEDIS
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
