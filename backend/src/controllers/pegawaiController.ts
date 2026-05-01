import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

export const getAllPegawai = async (req: Request, res: Response) => {
  const pegawai = await prisma.pegawai.findMany({
    include: { no_telp: true, akun: true, jadwal: true }
  });
  res.json(pegawai);
};

export const getDokter = async (req: Request, res: Response) => {
  const dokter = await prisma.pegawai.findMany({
    where: { role: 'DOKTER' },
    include: { no_telp: true, jadwal: true }
  });
  res.json(dokter);
};

export const getPegawaiById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const pegawai = await prisma.pegawai.findUnique({
    where: { id_pegawai: id },
    include: { no_telp: true, akun: true, jadwal: true }
  });

  if (!pegawai) {
    res.status(404).json({ error: 'Pegawai tidak ditemukan' });
    return;
  }
  res.json(pegawai);
};

export const createPegawai = async (req: Request, res: Response) => {
  const { nama, role, jalan, kota, kode_pos, spesialisasi, tipe_perawat, unit_bagian, no_telp, username, password } = req.body;

  const phoneData = no_telp && Array.isArray(no_telp) 
    ? no_telp.map((telp: string) => ({ no_telp: telp })) 
    : [];

  const akunData = username && password ? {
    create: {
      username,
      password: bcrypt.hashSync(password, 10)
    }
  } : undefined;

  const pegawai = await prisma.pegawai.create({
    data: {
      nama,
      role,
      jalan,
      kota,
      kode_pos,
      spesialisasi,
      tipe_perawat,
      unit_bagian,
      no_telp: { create: phoneData },
      akun: akunData
    },
    include: { no_telp: true, akun: true }
  });

  res.status(201).json(pegawai);
};

export const updatePegawai = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const { nama, role, jalan, kota, kode_pos, spesialisasi, tipe_perawat, unit_bagian, no_telp, username, password } = req.body;

  const phoneData = no_telp && Array.isArray(no_telp) 
    ? no_telp.map((telp: string) => ({ no_telp: telp })) 
    : [];

  // Update akun if needed
  let akunUpdate = undefined;
  if (username) {
    akunUpdate = {
      upsert: {
        create: {
          username,
          password: password ? bcrypt.hashSync(password, 10) : ''
        },
        update: {
          username,
          ...(password && { password: bcrypt.hashSync(password, 10) })
        }
      }
    };
  }

  const pegawai = await prisma.pegawai.update({
    where: { id_pegawai: id },
    data: {
      nama,
      role,
      jalan,
      kota,
      kode_pos,
      spesialisasi,
      tipe_perawat,
      unit_bagian,
      no_telp: no_telp ? {
        deleteMany: {},
        create: phoneData
      } : undefined,
      akun: akunUpdate
    },
    include: { no_telp: true, akun: true }
  });

  res.json(pegawai);
};

export const deletePegawai = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  
  // Hapus akun dulu kalau ada (karena foreign key restriction kalo ga cascade)
  // Prisma biasanya otomatis hapus klo ga ada akun, tp mending aman
  await prisma.akunPegawai.deleteMany({
    where: { pegawaiId: id }
  });

  await prisma.jadwalDokter.deleteMany({
    where: { dokterId: id }
  });

  await prisma.pegawai.delete({
    where: { id_pegawai: id }
  });
  
  res.json({ message: 'Pegawai berhasil dihapus' });
};
