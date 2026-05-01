import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pegawai } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const PegawaiPage: React.FC = () => {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    role: 'PERAWAT',
    jalan: '',
    kota: '',
    kode_pos: '',
    spesialisasi: '',
    tipe_perawat: '',
    unit_bagian: '',
    username: '',
    password: '',
    no_telp: ['']
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pegawai');
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
      nama: '', role: 'PERAWAT', jalan: '', kota: '', kode_pos: '',
      spesialisasi: '', tipe_perawat: '', unit_bagian: '', username: '', password: '',
      no_telp: ['']
    });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pegawai: Pegawai) => {
    setFormData({
      nama: pegawai.nama,
      role: pegawai.role,
      jalan: pegawai.jalan || '',
      kota: pegawai.kota || '',
      kode_pos: pegawai.kode_pos || '',
      spesialisasi: pegawai.spesialisasi || '',
      tipe_perawat: pegawai.tipe_perawat || '',
      unit_bagian: pegawai.unit_bagian || '',
      username: pegawai.akun?.username || '',
      password: '', // Kosongkan password saat edit
      no_telp: pegawai.no_telp.length > 0 ? pegawai.no_telp.map(t => t.no_telp) : ['']
    });
    setSelectedId(pegawai.id_pegawai);
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
      no_telp: formData.no_telp.filter(t => t.trim() !== '')
    };

    try {
      if (selectedId) {
        await api.put(`/pegawai/${selectedId}`, payload);
      } else {
        await api.post('/pegawai', payload);
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
      await api.delete(`/pegawai/${selectedId}`);
      setIsConfirmOpen(false);
      fetchData();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Gagal menghapus data');
    }
  };

  const renderRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'ADMIN': 'bg-blue-100 text-blue-700',
      'DOKTER': 'bg-green-100 text-green-700',
      'PERAWAT': 'bg-purple-100 text-purple-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Pegawai</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pegawai
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_pegawai}
          columns={[
            { header: 'Nama', accessor: 'nama' },
            { header: 'Role', accessor: (row) => renderRoleBadge(row.role) },
            { header: 'Spesialisasi/Unit', accessor: (row) => row.role === 'DOKTER' ? row.spesialisasi : (row.unit_bagian || '-') },
            { 
              header: 'No Telp', 
              accessor: (row) => row.no_telp.map((t: any) => t.no_telp).join(', ') || '-' 
            },
            {
              header: 'Username',
              accessor: (row) => row.akun?.username || '-'
            },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openDeleteConfirm(row.id_pegawai)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
        title={selectedId ? 'Edit Pegawai' : 'Tambah Pegawai'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai *</label>
              <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="PERAWAT">PERAWAT</option>
                <option value="DOKTER">DOKTER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {formData.role === 'DOKTER' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi</label>
                <input type="text" value={formData.spesialisasi} onChange={e => setFormData({...formData, spesialisasi: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
            )}

            {formData.role === 'PERAWAT' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Perawat</label>
                  <input type="text" value={formData.tipe_perawat} onChange={e => setFormData({...formData, tipe_perawat: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit/Bagian</label>
                  <input type="text" value={formData.unit_bagian} onChange={e => setFormData({...formData, unit_bagian: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </>
            )}

            <div className="col-span-2 border-t pt-4 mt-2">
              <h3 className="font-semibold text-gray-800 mb-3">Akun Login</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {selectedId && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                  </label>
                  <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!selectedId && !!formData.username} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>

            <div className="col-span-2 border-t pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
              {formData.no_telp.map((telp, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" value={telp} onChange={e => {
                    const newTelp = [...formData.no_telp];
                    newTelp[index] = e.target.value;
                    setFormData({...formData, no_telp: newTelp});
                  }} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                  <button type="button" onClick={() => {
                    const newTelp = formData.no_telp.filter((_, i) => i !== index);
                    setFormData({...formData, no_telp: newTelp.length ? newTelp : ['']});
                  }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData({...formData, no_telp: [...formData.no_telp, '']})} className="text-sm text-blue-600 font-medium hover:text-blue-800">
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
        title="Hapus Pegawai"
        message="Apakah Anda yakin ingin menghapus data pegawai ini beserta akun loginnya?"
      />
    </div>
  );
};
