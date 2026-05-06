import { PrismaClient, RolePegawai, TipeRawat } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

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
  const fasilitasData = [
    {
      nama_fasilitas: "IGD 24 Jam",
      icon: "🚑",
      deskripsi: "Pelayanan gawat darurat 24 jam",
    },
    {
      nama_fasilitas: "Laboratorium",
      icon: "🔬",
      deskripsi: "Pemeriksaan sampel klinis",
    },
    {
      nama_fasilitas: "Radiologi",
      icon: "🩻",
      deskripsi: "X-Ray, USG, dan CT Scan",
    },
    {
      nama_fasilitas: "Apotek",
      icon: "💊",
      deskripsi: "Pelayanan obat 24 jam",
    },
    {
      nama_fasilitas: "Rawat Inap",
      icon: "🛏️",
      deskripsi: "Kamar berbagai kelas",
    },
    {
      nama_fasilitas: "Kantin Sehat",
      icon: "☕",
      deskripsi: "Area makan pengunjung",
    },
  ];
  await prisma.fasilitas.createMany({ data: fasilitasData });

  // 3. Pegawai (Admin, Perawat, Dokter)
  const passwordHash = bcrypt.hashSync("password123", 10);

  // Admin
  const admin = await prisma.pegawai.create({
    data: {
      nama: "Rama Ardiansyah",
      role: RolePegawai.ADMIN,
      akun: { create: { username: "admin", password: passwordHash } },
    },
  });

  // 5 Perawat
  const nurseNames = [
    "Siti Aminah",
    "Dewi Lestari",
    "Bambang Pamungkas",
    "Eka Putri",
    "Rina Wijaya",
  ];
  for (let i = 0; i < nurseNames.length; i++) {
    await prisma.pegawai.create({
      data: {
        nama: nurseNames[i],
        role: RolePegawai.PERAWAT,
        tipe_perawat: i % 2 === 0 ? "Senior" : "Junior",
        unit_bagian: i % 2 === 0 ? "IGD" : "Poli Umum",
        akun: {
          create: { username: `perawat${i + 1}`, password: passwordHash },
        },
      },
    });
  }

  // 10 Dokter
  const doctorNames = [
    "dr. Ahmad Subarjo",
    "dr. Sarah Quinn",
    "dr. Indra Wijaya",
    "dr. Maria Ulfa",
    "dr. Kevin Sanjaya",
    "dr. Jessica Mila",
    "dr. Rizky Febian",
    "dr. Anya Geraldine",
    "dr. Deddy Corbuzier",
    "dr. Najwa Shihab",
  ];
  const spesialisasi = [
    "Umum",
    "Anak",
    "Bedah",
    "Penyakit Dalam",
    "Kandungan",
    "Saraf",
    "Mata",
    "THT",
    "Jantung",
    "Kulit",
  ];
  const dokterIds: number[] = [];
  for (let i = 0; i < 10; i++) {
    const dokter = await prisma.pegawai.create({
      data: {
        nama: doctorNames[i],
        role: RolePegawai.DOKTER,
        spesialisasi: spesialisasi[i],
        akun: {
          create: { username: `dokter${i + 1}`, password: passwordHash },
        },
        jadwal: {
          create: [
            { hari: "Senin", jam_mulai: "08:00", jam_selesai: "14:00" },
            { hari: "Rabu", jam_mulai: "08:00", jam_selesai: "14:00" },
          ],
        },
      },
    });
    dokterIds.push(dokter.id_pegawai);
  }

  // 4. Kamar (20 Kamar)
  const kamarData = [];
  for (let i = 1; i <= 5; i++)
    kamarData.push({ no_kamar: `VIP-${i}`, kelas: "VIP", tarif: 1000000 });
  for (let i = 1; i <= 15; i++)
    kamarData.push({ no_kamar: `Reg-${i}`, kelas: "Kelas 1", tarif: 400000 });
  await prisma.kamar.createMany({ data: kamarData });
  const allKamars = await prisma.kamar.findMany();

  // 5. 20 Obat
  const obatList = [
    "Paracetamol",
    "Amoxicillin",
    "Antasida",
    "Ibuprofen",
    "Cefadroxil",
    "Metformin",
    "Amlodipine",
    "Simvastatin",
    "Omeprazole",
    "Cetirizine",
    "Loperamide",
    "Dexamethasone",
    "Salbutamol",
    "Vitamin C",
    "Vitamin B12",
    "Asam Mefenamat",
    "Ranitidine",
    "Antihistamin",
    "Insulin",
    "Antibiotik",
  ];
  const createdObats = [];
  for (const name of obatList) {
    const o = await prisma.obat.create({
      data: {
        nama_obat: name,
        harga: Math.floor(Math.random() * 50000) + 5000,
        stok: 100,
      },
    });
    createdObats.push(o);
  }

  // 6. 10 Penyakit
  const penyakitList = [
    "Demam Berdarah",
    "ISPA",
    "Hipertensi",
    "Diabetes",
    "Tifus",
    "Asma",
    "Maag",
    "Alergi",
    "Flu Burung",
    "TBC",
  ];
  const createdPenyakits = [];
  for (const name of penyakitList) {
    const p = await prisma.penyakit.create({ data: { nama_penyakit: name } });
    createdPenyakits.push(p);
  }

  // 7. 30 Pasien dengan nama beragam
  const patientNames = [
    "Budi Santoso",
    "Joko Susilo",
    "Siti Fatimah",
    "Rina Gunawan",
    "Agus Prayitno",
    "Lani Hartati",
    "Dedi Mulyadi",
    "Ani Suryani",
    "Eko Prasetyo",
    "Yanto Berani",
    "Maya Saputri",
    "Hendra Setiawan",
    "Gisella Anastasia",
    "Raffi Ahmad",
    "Nagita Slavina",
    "Atta Halilintar",
    "Aurel Hermansyah",
    "Sule Prikitiw",
    "Andre Taulany",
    "Nunung Srimulat",
    "Tukul Arwana",
    "Indro Warkop",
    "Dono Kasino",
    "Kasino Indro",
    "Benyamin Sueb",
    "Nike Ardilla",
    "Iwan Fals",
    "Chrisye",
    "Agnez Mo",
    "Raisa Andriana",
  ];
  const pasienIds: number[] = [];
  for (let i = 0; i < 30; i++) {
    const p = await prisma.pasien.create({
      data: {
        nama: patientNames[i],
        jenis_kelamin: i % 2 === 0 ? "Laki-laki" : "Perempuan",
        tanggal_lahir: new Date(1970 + (i % 30), i % 12, (i % 28) + 1),
        jalan: `Jl. Melati No. ${i + 1}`,
        kota: "Jakarta",
        no_telp: {
          create: {
            no_telp: `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
          },
        },
      },
    });
    pasienIds.push(p.id_pasien);
  }

  // 8. Pendaftaran (Semua Pasien Daftar)
  const pendaftaranIds: number[] = [];
  for (let i = 0; i < 30; i++) {
    const isChecked = i < 20; // 20 pasien pertama diperiksa
    const pendaftaran = await prisma.pendaftaran.create({
      data: {
        tanggal_daftar: new Date(),
        keterangan_daftar: "Keluhan " + createdPenyakits[i % 10].nama_penyakit,
        pasienId: pasienIds[i],
        adminId: admin.id_pegawai,
        status: isChecked ? 'SELESAI' : 'MENUNGGU'
      },
    });
    pendaftaranIds.push(pendaftaran.id_pendaftaran);
  }


  // 9. Pemeriksaan (20 Pasien diperiksa)
  for (let i = 0; i < 20; i++) {
    const pemeriksaan = await prisma.pemeriksaan.create({
      data: {
        tanggal_pemeriksaan: new Date(),
        keluhan:
          "Pasien mengeluh " +
          createdPenyakits[i % 10].nama_penyakit.toLowerCase(),
        diagnosa: "Terindikasi " + createdPenyakits[i % 10].nama_penyakit,
        pendaftaranId: pendaftaranIds[i],
        dokterId: dokterIds[i % 10],
        penyakit: {
          connect: { id_penyakit: createdPenyakits[i % 10].id_penyakit },
        },
      },
    });

    // 10. Jenis Rawat (10 Rawat Inap, 10 Rawat Jalan)
    const isRawatInap = i < 10;
    const jr = await prisma.jenisRawat.create({
      data: {
        tipe_rawat: isRawatInap ? TipeRawat.RAWAT_INAP : TipeRawat.RAWAT_JALAN,
        pemeriksaanId: pemeriksaan.id_pemeriksaan,
        ...(isRawatInap
          ? {
              tanggal_masuk: new Date(),
              kamarId: allKamars[i].id_kamar,
            }
          : {
              no_antrian: `A-${i + 1}`,
              status_kontrol: "Selesai",
            }),
      },
    });

    // 11. Resep & Detail Obat
    const resep = await prisma.resep.create({
      data: {
        tanggal_resep: new Date(),
        jenisRawatId: jr.id_jenis_rawat,
        obat: { connect: { id_obat: createdObats[i].id_obat } },
      },
    });

    // 12. Pembayaran (Untuk 15 Pasien pertama)
    if (i < 15) {
      await prisma.pembayaran.create({
        data: {
          tgl_pembayaran: new Date(),
          jumlah: 150000 + Math.random() * 850000,
          metode_pembayaran: i % 3 === 0 ? "TRANSFER" : "CASH",
          status: "LUNAS",
          pasienId: pasienIds[i],
          pendaftaranId: pendaftaranIds[i],
          detail_obat: {
            create: {
              obatId: createdObats[i].id_obat,
              jumlah: 2,
              harga_satuan: createdObats[i].harga,
              dosis: "3x1 hari sesudah makan",
            },
          },
        },
      });
    }

  }

  console.log("Seeding finished successfully with diverse names.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
