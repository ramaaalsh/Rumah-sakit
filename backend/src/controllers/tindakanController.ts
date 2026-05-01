import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllTindakan = async (req: Request, res: Response) => {
  const data = await prisma.tindakan.findMany({
    include: { jenis_rawat: true, penyakit: true }});
  res.json(data);
};

export const getTindakanById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.tindakan.findUnique({
    where: { id_tindakan: id },
    include: { jenis_rawat: true, penyakit: true }
  });

  if (!data) {
    res.status(404).json({ error: 'Tindakan tidak ditemukan' });
    return;
  }
  res.json(data);
};

export const createTindakan = async (req: Request, res: Response) => {
  const data = await prisma.tindakan.create({
    data: req.body,
    include: { jenis_rawat: true, penyakit: true }
  });
  res.status(201).json(data);
};

export const updateTindakan = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await prisma.tindakan.update({
    where: { id_tindakan: id },
    data: req.body,
    include: { jenis_rawat: true, penyakit: true }
  });
  res.json(data);
};

export const deleteTindakan = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  await prisma.tindakan.delete({
    where: { id_tindakan: id }
  });
  res.json({ message: 'Tindakan berhasil dihapus' });
};
