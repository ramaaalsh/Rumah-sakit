import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Delete all existing data
  await prisma.detailObat.deleteMany();
  await prisma.pembayaran.deleteMany();
  await prisma.resep.deleteMany();
  await prisma.obat.deleteMany();
  await prisma.tindakan.deleteMany();
  await prisma.jenisRawat.deleteMany();
  await prisma.kamar.deleteMany();
  await prisma.penyakit.deleteMany();
  await prisma.pemeriksaan.deleteMany();
  await prisma.pendaftaran.deleteMany();
  await prisma.pasienTelp.deleteMany();
  await prisma.pasien.deleteMany();
  await prisma.akunPegawai.deleteMany();
  await prisma.jadwalDokter.deleteMany();
  await prisma.pegawaiTelp.deleteMany();
  await prisma.pegawai.deleteMany();
  await prisma.fasilitas.deleteMany();

  // 2. Fasilitas
  const fasilitas = [
    { nama_fasilitas: 'IGD 24 Jam', icon: '🚑', deskripsi: 'Pelayanan gawat darurat 24 jam dengan fasilitas lengkap' },
    { nama_fasilitas: 'Laboratorium', icon: '🔬', deskripsi: 'Pemeriksaan sampel darah, urin, dan lainnya' },
    { nama_fasilitas: 'Radiologi', icon: '🩻', deskripsi: 'Pemeriksaan X-Ray, USG, dan CT Scan' },
    { nama_fasilitas: 'Apotek', icon: '💊', deskripsi: 'Pelayanan resep obat 24 jam' },
    { nama_fasilitas: 'Rawat Inap', icon: '🛏️', deskripsi: 'Kamar rawat inap berbagai kelas' },
    { nama_fasilitas: 'Poli Umum', icon: '🏥', deskripsi: 'Pelayanan kesehatan umum' },
  ];
  for (const f of fasilitas) await prisma.fasilitas.create({ data: f });

  // 3. Pegawai + AkunPegawai + JadwalDokter
  const passwordAdmin = bcrypt.hashSync('admin123', 10);
  const passwordDokter = bcrypt.hashSync('dokter123', 10);
  const passwordPerawat = bcrypt.hashSync('perawat123', 10);

  const admin = await prisma.pegawai.create({
    data: {
      nama: 'Admin RS',
      role: 'ADMIN',
      akun: { create: { username: 'admin', password: passwordAdmin } }
    }
  });

  const dokter1 = await prisma.pegawai.create({
    data: {
      nama: 'dr. Budi Santoso',
      role: 'DOKTER',
      spesialisasi: 'Umum',
      akun: { create: { username: 'dokter1', password: passwordDokter } },
      jadwal: {
        create: [
          { hari: 'Senin', jam_mulai: '08:00', jam_selesai: '12:00' },
          { hari: 'Rabu', jam_mulai: '13:00', jam_selesai: '17:00' }
        ]
      }
    }
  });

  const dokter2 = await prisma.pegawai.create({
    data: {
      nama: 'dr. Siti Rahayu',
      role: 'DOKTER',
      spesialisasi: 'Anak',
      akun: { create: { username: 'dokter2', password: passwordDokter } },
      jadwal: {
        create: [
          { hari: 'Selasa', jam_mulai: '08:00', jam_selesai: '12:00' },
          { hari: 'Kamis', jam_mulai: '13:00', jam_selesai: '17:00' }
        ]
      }
    }
  });

  await prisma.pegawai.create({
    data: {
      nama: 'Ani Susanti',
      role: 'PERAWAT',
      tipe_perawat: 'Umum',
      unit_bagian: 'IGD',
      akun: { create: { username: 'perawat1', password: passwordPerawat } }
    }
  });

  // 4. Kamar
  const kamarData = [];
  for (let i = 1; i <= 5; i++) kamarData.push({ no_kamar: `V${i}`, kelas: 'VIP', tarif: 500000 });
  for (let i = 1; i <= 10; i++) kamarData.push({ no_kamar: `A${i}`, kelas: 'Kelas 1', tarif: 300000 });
  for (let i = 1; i <= 15; i++) kamarData.push({ no_kamar: `B${i}`, kelas: 'Kelas 2', tarif: 150000 });
  await prisma.kamar.createMany({ data: kamarData });

  // 5. Obat
  await prisma.obat.createMany({
    data: [
      { nama_obat: 'Paracetamol 500mg', harga: 5000, stok: 100 },
      { nama_obat: 'Amoxicillin 500mg', harga: 8000, stok: 80 },
      { nama_obat: 'Antasida', harga: 6000, stok: 60 }
    ]
  });

  // 6. Penyakit
  await prisma.penyakit.createMany({
    data: [
      { nama_penyakit: 'Demam Berdarah' },
      { nama_penyakit: 'ISPA' },
      { nama_penyakit: 'Hipertensi' },
      { nama_penyakit: 'Diabetes' }
    ]
  });

  // 7. Pasien & Pemeriksaan Demo
  const pasien = await prisma.pasien.create({
    data: {
      nama: 'Joko Widodo',
      jenis_kelamin: 'Laki-laki',
      tanggal_lahir: new Date('1980-01-01'),
      jalan: 'Jl. Merdeka No. 1',
      kota: 'Jakarta',
      kode_pos: '10110',
      no_telp: { create: { no_telp: '08123456789' } }
    }
  });

  const pendaftaran = await prisma.pendaftaran.create({
    data: {
      tanggal_daftar: new Date(),
      keterangan_daftar: 'Sakit Kepala',
      pasienId: pasien.id_pasien,
      adminId: admin.id_pegawai
    }
  });

  const ispa = await prisma.penyakit.findFirst({ where: { nama_penyakit: 'ISPA' }});

  if (ispa) {
    await prisma.pemeriksaan.create({
      data: {
        tanggal_pemeriksaan: new Date(),
        keluhan: 'Pusing dan demam',
        diagnosa: 'Infeksi Saluran Pernafasan',
        pendaftaranId: pendaftaran.id_pendaftaran,
        dokterId: dokter1.id_pegawai,
        penyakit: { connect: { id_penyakit: ispa.id_penyakit } }
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
