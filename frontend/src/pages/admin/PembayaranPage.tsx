import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Pembayaran, Pasien, Obat } from '../../types';
import { Table } from '../../components/admin/Table';
import { Modal } from '../../components/admin/Modal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Plus, Trash2, Trash } from 'lucide-react';

export const PembayaranPage: React.FC = () => {
  const [data, setData] = useState<Pembayaran[]>([]);
  const [pasienList, setPasienList] = useState<Pasien[]>([]);
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    pasienId: '',
    tgl_pembayaran: '',
    metode_pembayaran: 'Cash',
    jumlah: 0,
    detailObat: [{ obatId: '', jumlah: 1, dosis: '', harga_satuan: 0 }]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pemRes, pasRes, obRes] = await Promise.all([
        api.get('/pembayaran'),
        api.get('/pasien'),
        api.get('/obat')
      ]);
      setData(pemRes.data);
      setPasienList(pasRes.data);
      setObatList(obRes.data);
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update total jumlah based on detailObat
  useEffect(() => {
    const total = formData.detailObat.reduce((sum, detail) => {
      return sum + (detail.jumlah * detail.harga_satuan);
    }, 0);
    setFormData(prev => ({ ...prev, jumlah: total }));
  }, [formData.detailObat]);

  const openAddModal = () => {
    setFormData({
      pasienId: '',
      tgl_pembayaran: new Date().toISOString().split('T')[0],
      metode_pembayaran: 'Cash',
      jumlah: 0,
      detailObat: [{ obatId: '', jumlah: 1, dosis: '', harga_satuan: 0 }]
    });
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setIsConfirmOpen(true);
  };

  const handleObatChange = (index: number, obatId: string) => {
    const selectedObat = obatList.find(o => o.id_obat.toString() === obatId);
    if (!selectedObat) return;

    const newDetail = [...formData.detailObat];
    newDetail[index] = {
      ...newDetail[index],
      obatId,
      harga_satuan: selectedObat.harga
    };
    setFormData({ ...formData, detailObat: newDetail });
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetail = [...formData.detailObat];
    newDetail[index] = { ...newDetail[index], [field]: value };
    setFormData({ ...formData, detailObat: newDetail });
  };

  const addDetailRow = () => {
    setFormData({
      ...formData,
      detailObat: [...formData.detailObat, { obatId: '', jumlah: 1, dosis: '', harga_satuan: 0 }]
    });
  };

  const removeDetailRow = (index: number) => {
    const newDetail = formData.detailObat.filter((_, i) => i !== index);
    setFormData({ ...formData, detailObat: newDetail });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Asumsi pembuatan pembayaran bersarang dengan detailObat 
    // memerlukan manipulasi data tertentu di backend, atau custom endpoint.
    // Jika via crud generic, kita butuh menyesuaikan payload.
    const payload = {
      pasienId: parseInt(formData.pasienId),
      tgl_pembayaran: new Date(formData.tgl_pembayaran),
      metode_pembayaran: formData.metode_pembayaran,
      jumlah: formData.jumlah,
      detail_obat: {
        create: formData.detailObat.filter(d => d.obatId !== '').map(d => ({
          obatId: parseInt(d.obatId),
          jumlah: parseInt(d.jumlah as any),
          dosis: d.dosis,
          harga_satuan: parseFloat(d.harga_satuan as any)
        }))
      }
    };

    try {
      if (selectedId) {
        await api.put(`/pembayaran/${selectedId}`, payload);
      } else {
        await api.post('/pembayaran', payload);
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
      await api.delete(`/pembayaran/${selectedId}`);
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Data Pembayaran</h1>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pembayaran
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={data}
          keyExtractor={(row) => row.id_pembayaran}
          columns={[
            { header: 'Pasien', accessor: (row) => row.pasien?.nama || '-' },
            { header: 'Tanggal', accessor: (row) => formatDate(row.tgl_pembayaran) },
            { header: 'Metode', accessor: 'metode_pembayaran' },
            { header: 'Jumlah', accessor: (row) => <span className="font-bold text-green-700">{formatRupiah(row.jumlah)}</span> },
            {
              header: 'Aksi',
              accessor: (row) => (
                <div className="flex gap-2">
                  <button onClick={() => openDeleteConfirm(row.id_pembayaran)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          ]}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Pembayaran">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran *</label>
              <select required value={formData.metode_pembayaran} onChange={e => setFormData({...formData, metode_pembayaran: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer Bank</option>
                <option value="BPJS">BPJS / Asuransi</option>
                <option value="Kartu Kredit">Kartu Kredit</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembayaran *</label>
              <input required type="date" value={formData.tgl_pembayaran} onChange={e => setFormData({...formData, tgl_pembayaran: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>

            <div className="col-span-2 border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Detail Obat</h3>
                <button type="button" onClick={addDetailRow} className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium">
                  <Plus className="w-4 h-4 mr-1" /> Tambah Obat
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.detailObat.map((detail, index) => (
                  <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex-1 space-y-3">
                      <select required value={detail.obatId} onChange={e => handleObatChange(index, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <option value="" disabled>Pilih Obat</option>
                        {obatList.map(o => (
                          <option key={o.id_obat} value={o.id_obat}>{o.nama_obat} - {formatRupiah(o.harga)}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input type="number" min="1" required placeholder="Jumlah" value={detail.jumlah} onChange={e => handleDetailChange(index, 'jumlah', parseInt(e.target.value))} className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                        <input type="text" placeholder="Dosis (opsional)" value={detail.dosis} onChange={e => handleDetailChange(index, 'dosis', e.target.value)} className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 pt-1">
                      <button type="button" onClick={() => removeDetailRow(index)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                      <div className="font-semibold text-gray-700 text-sm mt-3">
                        {formatRupiah(detail.jumlah * detail.harga_satuan)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 bg-blue-50 p-4 rounded-xl flex justify-between items-center border border-blue-100 mt-4">
              <span className="font-bold text-gray-700">Total Pembayaran:</span>
              <span className="text-2xl font-bold text-blue-700">{formatRupiah(formData.jumlah)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Simpan Pembayaran</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Hapus Pembayaran" message="Apakah Anda yakin ingin menghapus data pembayaran ini?" />
    </div>
  );
};
