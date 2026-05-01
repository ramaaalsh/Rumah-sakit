import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Obat } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const ObatPage: React.FC = () => {
  const [data, setData] = useState<Obat[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nama_obat: '',
    harga: '',
    stok: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/obat');
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
    setFormData({ nama_obat: '', harga: '', stok: '' });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (obat: Obat) => {
    setFormData({
      nama_obat: obat.nama_obat,
      harga: obat.harga.toString(),
      stok: obat.stok.toString()
    });
    setSelectedId(obat.id_obat);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nama_obat: formData.nama_obat,
      harga: parseFloat(formData.harga),
      stok: parseInt(formData.stok)
    };

    try {
      if (selectedId) {
        await api.put(`/obat/${selectedId}`, payload);
      } else {
        await api.post('/obat', payload);
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
      await api.delete(`/obat/${selectedId}`);
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

  const renderStok = (stok: number) => {
    if (stok < 10) {
      return <div><span className="font-bold mr-2">{stok}</span><span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Stok Menipis</span></div>;
    }
    if (stok <= 30) {
      return <div><span className="font-bold mr-2">{stok}</span><span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Hampir Habis</span></div>;
    }
    return <span className="font-bold">{stok}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Obat</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Obat
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_obat}
          columns={[
            { header: 'Nama Obat', accessor: 'nama_obat' },
            { header: 'Harga', accessor: (row) => formatRupiah(row.harga) },
            { header: 'Stok', accessor: (row) => renderStok(row.stok) },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_obat)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Edit Obat' : 'Tambah Obat'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Obat *</label>
            <input required type="text" value={formData.nama_obat} onChange={e => setFormData({...formData, nama_obat: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga *</label>
            <input required type="number" min="0" value={formData.harga} onChange={e => setFormData({...formData, harga: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
            <input required type="number" min="0" value={formData.stok} onChange={e => setFormData({...formData, stok: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Hapus Obat" message="Apakah Anda yakin ingin menghapus data obat ini?" />
    </div>
  );
};
