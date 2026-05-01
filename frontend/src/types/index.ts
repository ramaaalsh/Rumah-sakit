export interface Pegawai {
  id_pegawai: number;
  nama: string;
  role: 'ADMIN' | 'DOKTER' | 'PERAWAT';
  jalan?: string;
  kota?: string;
  kode_pos?: string;
  spesialisasi?: string;
  tipe_perawat?: string;
  unit_bagian?: string;
  no_telp: { id: number; no_telp: string }[];
  akun?: any;
  jadwal?: JadwalDokter[];
}

export interface Pasien {
  id_pasien: number;
  nama: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  jalan?: string;
  kota?: string;
  kode_pos?: string;
  no_telp: { id: number; no_telp: string }[];
}

export interface Pendaftaran {
  id_pendaftaran: number;
  tanggal_daftar: string;
  keterangan_daftar?: string;
  pasien: Pasien;
  admin: Pegawai;
}

export interface Pemeriksaan {
  id_pemeriksaan: number;
  tanggal_pemeriksaan: string;
  keluhan: string;
  diagnosa: string;
  pendaftaran: Pendaftaran;
  dokter: Pegawai;
  penyakit: Penyakit[];
}

export interface Penyakit {
  id_penyakit: number;
  nama_penyakit: string;
  keterangan_penyakit?: string;
  tindakan: Tindakan[];
}

export interface Tindakan {
  id_tindakan: number;
  nama_tindakan: string;
  biaya_tindakan: number;
  jenis_rawat?: JenisRawat;
}

export interface JenisRawat {
  id_jenis_rawat: number;
  tipe_rawat: 'RAWAT_INAP' | 'RAWAT_JALAN';
  tanggal_masuk?: string;
  tanggal_keluar?: string;
  kamar?: Kamar;
  no_antrian?: string;
  status_kontrol?: string;
}

export interface Kamar {
  id_kamar: number;
  no_kamar: string;
  kelas: string;
  tarif: number;
}

export interface Obat {
  id_obat: number;
  nama_obat: string;
  harga: number;
  stok: number;
}

export interface Resep {
  id_resep: number;
  tanggal_resep: string;
  jenis_rawat: JenisRawat;
  obat: Obat[];
}

export interface DetailObat {
  id_detail: number;
  jumlah: number;
  dosis?: string;
  jenis_obat?: string;
  harga_satuan: number;
  obat: Obat;
}

export interface Pembayaran {
  id_pembayaran: number;
  tgl_pembayaran: string;
  jumlah: number;
  metode_pembayaran: string;
  pasien: Pasien;
  detail_obat: DetailObat[];
}

export interface Fasilitas {
  id_fasilitas: number;
  nama_fasilitas: string;
  deskripsi?: string;
  icon?: string;
}

export interface JadwalDokter {
  id_jadwal: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  dokter: Pegawai;
}

export interface AuthUser {
  id: number;
  nama: string;
  role: 'ADMIN' | 'DOKTER' | 'PERAWAT';
  token: string;
}
