import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Fasilitas } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const FasilitasAdminPage: React.FC = () => {
  const [data, setData] = useState<Fasilitas[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nama_fasilitas: '',
    deskripsi: '',
    icon: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fasilitas');
      setData(res.data);
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
    setFormData({ nama_fasilitas: '', deskripsi: '', icon: '' });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (fasilitas: Fasilitas) => {
    setFormData({
      nama_fasilitas: fasilitas.nama_fasilitas,
      deskripsi: fasilitas.deskripsi || '',
      icon: fasilitas.icon || ''
    });
    setSelectedId(fasilitas.id_fasilitas);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await api.put(`/fasilitas/${selectedId}`, formData);
      } else {
        await api.post('/fasilitas', formData);
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
      await api.delete(`/fasilitas/${selectedId}`);
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
        <h1 className="text-2xl font-bold text-gray-900">Data Fasilitas</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Fasilitas
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_fasilitas}
          columns={[
            { header: 'Icon', accessor: (row) => <span className="text-2xl">{row.icon}</span> },
            { header: 'Nama Fasilitas', accessor: 'nama_fasilitas' },
            { header: 'Deskripsi', accessor: 'deskripsi' },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_fasilitas)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Edit Fasilitas' : 'Tambah Fasilitas'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji/Teks) *</label>
            <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Contoh: 🏥" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Fasilitas *</label>
            <input required type="text" value={formData.nama_fasilitas} onChange={e => setFormData({...formData, nama_fasilitas: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea rows={3} value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Hapus Fasilitas" message="Apakah Anda yakin ingin menghapus data fasilitas ini?" />
    </div>
  );
};
