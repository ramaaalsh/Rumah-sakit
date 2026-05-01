import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPasien = async (req: Request, res: Response) => {
  const pasien = await prisma.pasien.findMany({
    include: { no_telp: true }
  });
  res.json(pasien);
};

export const getPasienById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const pasien = await prisma.pasien.findUnique({
    where: { id_pasien: id },
    include: { no_telp: true, pendaftaran: true }
  });

  if (!pasien) {
    res.status(404).json({ error: 'Pasien tidak ditemukan' });
    return;
  }
  res.json(pasien);
};

export const createPasien = async (req: Request, res: Response) => {
  const { nama, jenis_kelamin, tanggal_lahir, jalan, kota, kode_pos, no_telp } = req.body;

  // no_telp di-expect sebagai array string: ["08123", "08124"]
  const phoneData = no_telp && Array.isArray(no_telp) 
    ? no_telp.map((telp: string) => ({ no_telp: telp })) 
    : [];

  const pasien = await prisma.pasien.create({
    data: {
      nama,
      jenis_kelamin,
      tanggal_lahir: new Date(tanggal_lahir),
      jalan,
      kota,
      kode_pos,
      no_telp: {
        create: phoneData
      }
    },
    include: { no_telp: true }
  });

  res.status(201).json(pasien);
};

export const updatePasien = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const { nama, jenis_kelamin, tanggal_lahir, jalan, kota, kode_pos, no_telp } = req.body;

  const phoneData = no_telp && Array.isArray(no_telp) 
    ? no_telp.map((telp: string) => ({ no_telp: telp })) 
    : [];

  const pasien = await prisma.pasien.update({
    where: { id_pasien: id },
    data: {
      nama,
      jenis_kelamin,
      tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : undefined,
      jalan,
      kota,
      kode_pos,
      // Untuk update relasi one-to-many, lebih mudah delete semua lalu create lagi
      no_telp: no_telp ? {
        deleteMany: {},
        create: phoneData
      } : undefined
    },
    include: { no_telp: true }
  });

  res.json(pasien);
};

export const deletePasien = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  
  await prisma.pasien.delete({
    where: { id_pasien: id }
  });
  
  res.json({ message: 'Pasien berhasil dihapus' });
};
