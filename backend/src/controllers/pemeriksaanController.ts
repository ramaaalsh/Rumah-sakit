import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPemeriksaan = async (req: Request, res: Response) => {
  const data = await prisma.pemeriksaan.findMany({
    include: { pendaftaran: { include: { pasien: true } }, dokter: true, penyakit: true }});
  res.json(data);
};

export const getPemeriksaanById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.pemeriksaan.findUnique({
    where: { id_pemeriksaan: id },
    include: { pendaftaran: { include: { pasien: true } }, dokter: true, penyakit: true }
  });

  if (!data) {
    res.status(404).json({ error: 'Pemeriksaan tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createPemeriksaan = async (req: Request, res: Response) => {
  const data = await prisma.pemeriksaan.create({
    data: req.body,
    include: { pendaftaran: { include: { pasien: true } }, dokter: true, penyakit: true }
  });
  res.status(201).json(data);
};

export const updatePemeriksaan = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.pemeriksaan.update({
    where: { id_pemeriksaan: id },
    data: req.body,
    include: { pendaftaran: { include: { pasien: true } }, dokter: true, penyakit: true }
  });
  res.json(data);
};

export const deletePemeriksaan = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.pemeriksaan.delete({
    where: { id_pemeriksaan: id }
  });
  res.json({ message: 'Pemeriksaan berhasil dihapus' });
};
