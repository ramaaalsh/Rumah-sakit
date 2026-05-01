import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pasien } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const PasienPage: React.FC = () => {
  const [data, setData] = useState<Pasien[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    jenis_kelamin: 'Laki-laki',
    tanggal_lahir: '',
    jalan: '',
    kota: '',
    kode_pos: '',
    no_telp: ['']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pasien');
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
    setFormData({
      nama: '',
      jenis_kelamin: 'Laki-laki',
      tanggal_lahir: '',
      jalan: '',
      kota: '',
      kode_pos: '',
      no_telp: ['']
    });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pasien: Pasien) => {
    setFormData({
      nama: pasien.nama,
      jenis_kelamin: pasien.jenis_kelamin,
      tanggal_lahir: pasien.tanggal_lahir ? new Date(pasien.tanggal_lahir).toISOString().split('T')[0] : '',
      jalan: pasien.jalan || '',
      kota: pasien.kota || '',
      kode_pos: pasien.kode_pos || '',
      no_telp: pasien.no_telp.length > 0 ? pasien.no_telp.map(t => t.no_telp) : ['']
    });
    setSelectedId(pasien.id_pasien);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter empty phones
    const payload = {
      ...formData,
      no_telp: formData.no_telp.filter(t => t.trim() !== '')
    };

    try {
      if (selectedId) {
        await api.put(`/pasien/${selectedId}`, payload);
      } else {
        await api.post('/pasien', payload);
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
      await api.delete(`/pasien/${selectedId}`);
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

  const formatAlamat = (row: Pasien) => {
    const parts = [];
    if (row.jalan) parts.push(row.jalan);
    if (row.kota) parts.push(row.kota);
    if (row.kode_pos) parts.push(row.kode_pos);
    return parts.join(', ') || '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Pasien</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pasien
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_pasien}
          columns={[
            { header: 'Nama', accessor: 'nama' },
            { header: 'L/P', accessor: 'jenis_kelamin' },
            { header: 'Tgl Lahir', accessor: (row) => formatDate(row.tanggal_lahir) },
            { header: 'Alamat', accessor: formatAlamat },
            { 
              header: 'No Telp', 
              accessor: (row) => row.no_telp.map((t: any) => t.no_telp).join(', ') || '-' 
            },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_pasien)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedId ? 'Edit Pasien' : 'Tambah Pasien'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasien *</label>
              <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
              <select value={formData.jenis_kelamin} onChange={e => setFormData({...formData, jenis_kelamin: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir *</label>
              <input required type="date" value={formData.tanggal_lahir} onChange={e => setFormData({...formData, tanggal_lahir: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jalan</label>
              <input type="text" value={formData.jalan} onChange={e => setFormData({...formData, jalan: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
              <input type="text" value={formData.kota} onChange={e => setFormData({...formData, kota: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
              <input type="text" value={formData.kode_pos} onChange={e => setFormData({...formData, kode_pos: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div className="col-span-2 border-t pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
              {formData.no_telp.map((telp, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={telp} 
                    onChange={e => {
                      const newTelp = [...formData.no_telp];
                      newTelp[index] = e.target.value;
                      setFormData({...formData, no_telp: newTelp});
                    }} 
                    placeholder="0812..." 
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const newTelp = formData.no_telp.filter((_, i) => i !== index);
                      setFormData({...formData, no_telp: newTelp.length ? newTelp : ['']});
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setFormData({...formData, no_telp: [...formData.no_telp, '']})}
                className="text-sm text-blue-600 font-medium hover:text-blue-800"
              >
                + Tambah No Telp
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pasien"
        message="Apakah Anda yakin ingin menghapus data pasien ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};
