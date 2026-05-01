import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllJenisRawat = async (req: Request, res: Response) => {
  const data = await prisma.jenisRawat.findMany({
    include: { kamar: true, tindakan: true, resep: true }});
  res.json(data);
};

export const getJenisRawatById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.jenisRawat.findUnique({
    where: { id_jenis_rawat: id },
    include: { kamar: true, tindakan: true, resep: true }
  });

  if (!data) {
    res.status(404).json({ error: 'JenisRawat tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createJenisRawat = async (req: Request, res: Response) => {
  const data = await prisma.jenisRawat.create({
    data: req.body,
    include: { kamar: true, tindakan: true, resep: true }
  });
  res.status(201).json(data);
};

export const updateJenisRawat = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.jenisRawat.update({
    where: { id_jenis_rawat: id },
    data: req.body,
    include: { kamar: true, tindakan: true, resep: true }
  });
  res.json(data);
};

export const deleteJenisRawat = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.jenisRawat.delete({
    where: { id_jenis_rawat: id }
  });
  res.json({ message: 'JenisRawat berhasil dihapus' });
};
