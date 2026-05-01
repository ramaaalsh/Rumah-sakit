import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { JadwalDokter, Pegawai } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const JadwalDokterPage: React.FC = () => {
  const [data, setData] = useState<JadwalDokter[]>([]);
  const [dokterList, setDokterList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    dokterId: '',
    hari: 'Senin',
    jam_mulai: '',
    jam_selesai: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jadwalRes, dokterRes] = await Promise.all([
        api.get('/jadwal-dokter'),
        api.get('/pegawai/dokter')
      ]);
      setData(jadwalRes.data);
      setDokterList(dokterRes.data);
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData({ dokterId: '', hari: 'Senin', jam_mulai: '', jam_selesai: '' });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (jadwal: JadwalDokter) => {
    setFormData({
      dokterId: jadwal.dokter.id_pegawai.toString(),
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai
    });
    setSelectedId(jadwal.id_jadwal);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dokterId: parseInt(formData.dokterId)
    };

    try {
      if (selectedId) {
        await api.put(`/jadwal-dokter/${selectedId}`, payload);
      } else {
        await api.post('/jadwal-dokter', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Save failed', error);
      alert('Gagal menyimpan data');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/jadwal-dokter/${selectedId}`);
      setIsConfirmOpen(false);
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus data');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Dokter</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Jadwal
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_jadwal}
          columns={[
            { header: 'Nama Dokter', accessor: (row) => row.dokter?.nama || '-' },
            { header: 'Spesialisasi', accessor: (row) => row.dokter?.spesialisasi || 'Umum' },
            { header: 'Hari', accessor: 'hari' },
            { header: 'Jam Mulai', accessor: 'jam_mulai' },
            { header: 'Jam Selesai', accessor: 'jam_selesai' },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_jadwal)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Edit Jadwal' : 'Tambah Jadwal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dokter *</label>
            <select required value={formData.dokterId} onChange={e => setFormData({...formData, dokterId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="" disabled>Pilih Dokter</option>
              {dokterList.map(d => (
                <option key={d.id_pegawai} value={d.id_pegawai}>{d.nama} - {d.spesialisasi || 'Umum'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hari *</label>
            <select required value={formData.hari} onChange={e => setFormData({...formData, hari: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai *</label>
              <input required type="time" value={formData.jam_mulai} onChange={e => setFormData({...formData, jam_mulai: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai *</label>
              <input required type="time" value={formData.jam_selesai} onChange={e => setFormData({...formData, jam_selesai: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Hapus Jadwal" message="Apakah Anda yakin ingin menghapus data jadwal ini?" />
    </div>
  );
};
