import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pendaftaran, Pasien } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const PendaftaranPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Pendaftaran[]>([]);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    tanggal_daftar: '',
    keterangan_daftar: '',
    pasienId: '',
    metode_pembayaran: 'CASH',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendRes, pasienRes] = await Promise.all([
        api.get('/pendaftaran'),
        api.get('/pasien')
      ]);
      setData(pendRes.data);
      setPasienList(pasienRes.data);
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
    setFormData({
      tanggal_daftar: new Date().toISOString().split('T')[0],
      keterangan_daftar: '',
      pasienId: '',
      metode_pembayaran: 'CASH',
    });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pend: any) => {
    setFormData({
      tanggal_daftar: new Date(pend.tanggal_daftar).toISOString().split('T')[0],
      keterangan_daftar: pend.keterangan_daftar || '',
      pasienId: pend.pasien.id_pasien.toString(),
      metode_pembayaran: pend.metode_pembayaran || 'CASH',
    });
    setSelectedId(pend.id_pendaftaran);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tanggal_daftar: new Date(formData.tanggal_daftar),
      keterangan_daftar: formData.keterangan_daftar,
      pasienId: parseInt(formData.pasienId),
      adminId: user?.id,
      metode_pembayaran: formData.metode_pembayaran
    };

    try {
      if (selectedId) {
        await api.put(`/pendaftaran/${selectedId}`, payload);
      } else {
        await api.post('/pendaftaran', payload);
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
      await api.delete(`/pendaftaran/${selectedId}`);
      setIsConfirmOpen(false);
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus data');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Pendaftaran</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pendaftaran
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_pendaftaran}
          columns={[
            { header: 'Nama Pasien', accessor: (row) => row.pasien?.nama || '-' },
            { header: 'Tanggal Daftar', accessor: (row) => formatDate(row.tanggal_daftar) },
            { header: 'Keterangan', accessor: 'keterangan_daftar' },
            { header: 'Pembayaran', accessor: (row) => (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{row.metode_pembayaran || 'CASH'}</span>
            )},
            { header: 'Admin Pencatat', accessor: (row) => row.admin?.nama || '-' },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_pendaftaran)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedId ? 'Edit Pendaftaran' : 'Tambah Pendaftaran'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pasien *</label>
            <select required value={formData.pasienId} onChange={e => setFormData({...formData, pasienId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="" disabled>Pilih Pasien</option>
              {pasienList.map(p => (
                <option key={p.id_pasien} value={p.id_pasien}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Daftar *</label>
            <input required type="date" value={formData.tanggal_daftar} onChange={e => setFormData({...formData, tanggal_daftar: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran *</label>
              <select required value={formData.metode_pembayaran} onChange={e => setFormData({...formData, metode_pembayaran: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="CASH">CASH</option>
                <option value="TRANSFER">TRANSFER</option>
                <option value="BPJS">BPJS / ASURANSI</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Keluhan Awal</label>
            <textarea rows={3} value={formData.keterangan_daftar} onChange={e => setFormData({...formData, keterangan_daftar: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>

          
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            Pendaftaran ini akan dicatat atas nama Admin: <strong>{user?.nama}</strong>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Hapus Pendaftaran" message="Apakah Anda yakin ingin menghapus data pendaftaran ini?" />
    </div>
  );
};
