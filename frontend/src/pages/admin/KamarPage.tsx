import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Kamar } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const KamarPage: React.FC = () => {
  const [data, setData] = useState<Kamar[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    no_kamar: '',
    kelas: 'VIP',
    tarif: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kamar');
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
    setFormData({ no_kamar: '', kelas: 'VIP', tarif: '' });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (kamar: Kamar) => {
    setFormData({
      no_kamar: kamar.no_kamar,
      kelas: kamar.kelas,
      tarif: kamar.tarif.toString()
    });
    setSelectedId(kamar.id_kamar);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      no_kamar: formData.no_kamar,
      kelas: formData.kelas,
      tarif: parseFloat(formData.tarif)
    };

    try {
      if (selectedId) {
        await api.put(`/kamar/${selectedId}`, payload);
      } else {
        await api.post('/kamar', payload);
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
      await api.delete(`/kamar/${selectedId}`);
      setIsConfirmOpen(false);
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus data');
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  const renderKelas = (kelas: string) => {
    const colors: Record<string, string> = {
      'VIP': 'bg-purple-100 text-purple-700',
      'Kelas 1': 'bg-blue-100 text-blue-700',
      'Kelas 2': 'bg-green-100 text-green-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[kelas] || 'bg-gray-100 text-gray-700'}`}>
        {kelas}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Kamar</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Kamar
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_kamar}
          columns={[
            { header: 'No Kamar', accessor: 'no_kamar' },
            { header: 'Kelas', accessor: (row) => renderKelas(row.kelas) },
            { header: 'Tarif', accessor: (row) => formatRupiah(row.tarif) },
            {
              header: 'Status',
              accessor: (row) => (
                <div className="flex flex-col">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold w-fit ${
                    row.status === 'TERPAKAI' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {row.status || 'TERSEDIA'}
                  </span>
                  {row.status === 'TERPAKAI' && row.pasienNama && (
                    <span className="text-[10px] text-gray-500 mt-1 font-medium">
                      Pasien: {row.pasienNama}
                    </span>
                  )}
                </div>
              )
            },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_kamar)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Edit Kamar' : 'Tambah Kamar'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Kamar *</label>
            <input required type="text" value={formData.no_kamar} onChange={e => setFormData({...formData, no_kamar: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas *</label>
            <select required value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="VIP">VIP</option>
              <option value="Kelas 1">Kelas 1</option>
              <option value="Kelas 2">Kelas 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarif *</label>
            <input required type="number" min="0" value={formData.tarif} onChange={e => setFormData({...formData, tarif: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Hapus Kamar" message="Apakah Anda yakin ingin menghapus data kamar ini?" />
    </div>
  );
};
