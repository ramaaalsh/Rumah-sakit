import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllJadwalDokter = async (req: Request, res: Response) => {
  const data = await prisma.jadwalDokter.findMany({
    include: { dokter: true }});
  res.json(data);
};

export const getJadwalDokterById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.jadwalDokter.findUnique({
    where: { id_jadwal: id },
    include: { dokter: true }
  });

  if (!data) {
    res.status(404).json({ error: 'JadwalDokter tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createJadwalDokter = async (req: Request, res: Response) => {
  const data = await prisma.jadwalDokter.create({
    data: req.body,
    include: { dokter: true }
  });
  res.status(201).json(data);
};

export const updateJadwalDokter = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.jadwalDokter.update({
    where: { id_jadwal: id },
    data: req.body,
    include: { dokter: true }
  });
  res.json(data);
};

export const deleteJadwalDokter = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.jadwalDokter.delete({
    where: { id_jadwal: id }
  });
  res.json({ message: 'JadwalDokter berhasil dihapus' });
};
